import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoMalla, Rol } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// ─── Caller ────────────────────────────────────────────────
interface Caller {
  id_usuario:      number;
  nombre:          string;
  email:           string;
  rol:             Rol;
  id_departamento: number | null;
  id_moderador:    number | null;
  acceso_global:   boolean;
}

// ─── Helpers ───────────────────────────────────────────────

// Duración de un turno en horas.
// hora_inicio y hora_fin son @db.Time() → base date 1970-01-01 UTC.
function calcHoras(inicio: Date, fin: Date): number {
  return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
}

// Combina la fecha del turno (YYYY-MM-DD) con la hora (@db.Time())
// para obtener un datetime real comparable.
function buildDatetime(fecha: Date, hora: Date): Date {
  const dt = new Date(fecha);
  dt.setUTCHours(hora.getUTCHours(), hora.getUTCMinutes(), 0, 0);
  return dt;
}

// Clave de semana ISO: "2026-W27" — agrupa turnos por semana calendario.
function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo    = Math.ceil(
    (((d.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── GUARD: solo SA o ADM Global ─────────────────────────
  private assertPuedeEscribir(caller: Caller): void {
    if (caller.rol === Rol.SA) return;
    if (caller.rol === Rol.ADM && caller.acceso_global) return;
    throw new ForbiddenException(
      'Solo un Administrador Global puede ejecutar la validación CST.',
    );
  }

  // ─── VALIDATE ─────────────────────────────────────────────
  async validate(id_malla: number, caller: Caller) {
    this.assertPuedeEscribir(caller);

    // ── Paso 1: cargar malla ──────────────────────────────
    const malla = await this.prisma.malla.findUnique({
      where:   { id_malla },
      include: { departamento: { select: { id_departamento: true, nombre: true } } },
    });
    if (!malla) {
      throw new NotFoundException(`Malla con ID ${id_malla} no encontrada.`);
    }

    // ── Paso 2: no re-evaluar mallas publicadas ───────────
    if (malla.estado === EstadoMalla.Publicada) {
      throw new BadRequestException(
        'No se puede re-evaluar una malla ya publicada.',
      );
    }

    // ── Paso 3: cargar ConfiguracionST con fallback ───────
    const config = await this.prisma.configuracionST.findUnique({
      where: { id_departamento: malla.id_departamento },
    });
    const max_horas_semana   = config?.max_horas_semana   ?? 48;
    const min_descanso_horas = config?.min_descanso_horas ?? 12;
    const max_dias_seguidos  = config?.max_dias_seguidos  ?? 6;

    // ── Paso 4: cargar todos los turnos en una sola query ─
    const turnos = await this.prisma.turno.findMany({
      where:   { id_malla },
      orderBy: [{ id_usuario: 'asc' }, { fecha: 'asc' }],
    });

    if (turnos.length === 0) {
      return {
        total_turnos:      0,
        total_conflictos:  0,
        total_limpios:     0,
        reglas_aplicadas:  { max_horas_semana, min_descanso_horas, max_dias_seguidos },
        conflictos:        [],
      };
    }

    // ── Paso 5: resetear flags — idempotencia garantizada ─
    await this.prisma.turno.updateMany({
      where: { id_malla },
      data:  { cst_conflicto: false, cst_detalle: null },
    });

    // ── Paso 6: agrupar por usuario en memoria ────────────
    const turnosPorUsuario = new Map<number, typeof turnos>();
    for (const t of turnos) {
      if (!turnosPorUsuario.has(t.id_usuario)) {
        turnosPorUsuario.set(t.id_usuario, []);
      }
      turnosPorUsuario.get(t.id_usuario)!.push(t);
    }

    // ── Paso 7: evaluar las 3 reglas CST por usuario ─────
    // conflictosMap: id_turno → string[] de violaciones (puede acumular varias)
    const conflictosMap = new Map<number, string[]>();

    const addConflicto = (id_turno: number, detalle: string): void => {
      if (!conflictosMap.has(id_turno)) conflictosMap.set(id_turno, []);
      conflictosMap.get(id_turno)!.push(detalle);
    };

    for (const [, userTurnos] of turnosPorUsuario) {
      // userTurnos ya ordenados por fecha asc

      // ── Regla 1: max_horas_semana ─────────────────────
      const semanas = new Map<string, typeof turnos>();
      for (const t of userTurnos) {
        const key = getISOWeekKey(t.fecha);
        if (!semanas.has(key)) semanas.set(key, []);
        semanas.get(key)!.push(t);
      }
      for (const [semanaKey, semanaTurnos] of semanas) {
        let acumulado = 0;
        for (const t of semanaTurnos) {
          acumulado += calcHoras(t.hora_inicio, t.hora_fin);
          if (acumulado > max_horas_semana) {
            addConflicto(
              t.id_turno,
              `Semana ${semanaKey}: excede máximo de horas semanales ` +
              `(${max_horas_semana}h) — acumulado: ${acumulado.toFixed(1)}h.`,
            );
          }
        }
      }

      // ── Regla 2: min_descanso_horas ───────────────────
      for (let i = 1; i < userTurnos.length; i++) {
        const prev     = userTurnos[i - 1];
        const curr     = userTurnos[i];
        const finPrev  = buildDatetime(prev.fecha, prev.hora_fin);
        const iniCurr  = buildDatetime(curr.fecha, curr.hora_inicio);
        const descanso = (iniCurr.getTime() - finPrev.getTime()) / (1000 * 60 * 60);
        if (descanso < min_descanso_horas) {
          addConflicto(
            curr.id_turno,
            `Descanso insuficiente entre turnos (mínimo ${min_descanso_horas}h) — ` +
            `solo ${descanso.toFixed(1)}h entre el turno anterior y este.`,
          );
        }
      }

      // ── Regla 3: max_dias_seguidos ────────────────────
      let racha = 1;
      for (let i = 1; i < userTurnos.length; i++) {
        const diffDias =
          (userTurnos[i].fecha.getTime() - userTurnos[i - 1].fecha.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diffDias === 1) {
          racha++;
          if (racha > max_dias_seguidos) {
            addConflicto(
              userTurnos[i].id_turno,
              `Excede máximo de días consecutivos (${max_dias_seguidos}) — ` +
              `racha actual: ${racha} días.`,
            );
          }
        } else {
          racha = 1;
        }
      }
    }

    // ── Paso 8 & 9: persistir conflictos en una transacción ─
    if (conflictosMap.size > 0) {
      await this.prisma.$transaction(
        Array.from(conflictosMap.entries()).map(([id_turno, detalles]) =>
          this.prisma.turno.update({
            where: { id_turno },
            data: {
              cst_conflicto: true,
              cst_detalle:   detalles.join(' | '),
            },
          }),
        ),
      );
    }

    // ── Paso 10: retornar resumen ─────────────────────────
    const turnosMap = new Map(turnos.map((t) => [t.id_turno, t]));

    const conflictosResponse = Array.from(conflictosMap.entries()).map(
      ([id_turno, detalles]) => {
        const t = turnosMap.get(id_turno)!;
        return {
          id_turno,
          id_usuario:  t.id_usuario,
          fecha:       t.fecha.toISOString().slice(0, 10),
          cst_detalle: detalles.join(' | '),
        };
      },
    );

    return {
      total_turnos:     turnos.length,
      total_conflictos: conflictosMap.size,
      total_limpios:    turnos.length - conflictosMap.size,
      reglas_aplicadas: { max_horas_semana, min_descanso_horas, max_dias_seguidos },
      conflictos:       conflictosResponse,
    };
  }
}