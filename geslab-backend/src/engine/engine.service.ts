import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoMalla, EstadoTurno, Prisma, Rol } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateShiftsDto } from './dto/generate-shifts.dto';

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

// ─── Helper: genera un Date[] de periodo_inicio a periodo_fin inclusive ──
// Opera en UTC para consistencia con @db.Date de Prisma.
function buildFechas(inicio: Date, fin: Date): Date[] {
  const fechas: Date[] = [];
  const current = new Date(inicio);
  while (current <= fin) {
    fechas.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return fechas;
}

@Injectable()
export class EngineService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── GUARD: solo SA o ADM Global puede ejecutar el engine ─
  private assertPuedeEscribir(caller: Caller): void {
    if (caller.rol === Rol.SA) return;
    if (caller.rol === Rol.ADM && caller.acceso_global) return;
    throw new ForbiddenException(
      'Solo un Administrador Global puede generar turnos.',
    );
  }

  // ─── GENERATE ─────────────────────────────────────────────
  async generate(dto: GenerateShiftsDto, caller: Caller) {
    this.assertPuedeEscribir(caller);

    // ── Paso 1: cargar malla ───────────────────────────────
    const malla = await this.prisma.malla.findUnique({
      where:   { id_malla: dto.id_malla },
      include: { departamento: { select: { id_departamento: true, nombre: true } } },
    });
    if (!malla) {
      throw new NotFoundException(`Malla con ID ${dto.id_malla} no encontrada.`);
    }

    // ── Paso 2: verificar estado Borrador ─────────────────
    if (malla.estado !== EstadoMalla.Borrador) {
      throw new BadRequestException(
        `La malla debe estar en estado Borrador para generar turnos. ` +
        `Estado actual: "${malla.estado}".`,
      );
    }

    // ── Paso 3: cargar plantilla y verificar activa ───────
    const plantilla = await this.prisma.plantillaTurno.findUnique({
      where: { id_plantilla: dto.id_plantilla },
    });
    if (!plantilla) {
      throw new NotFoundException(`Plantilla con ID ${dto.id_plantilla} no encontrada.`);
    }
    if (!plantilla.activa) {
      throw new BadRequestException(
        `La plantilla "${plantilla.nombre}" está inactiva y no puede usarse para generar turnos.`,
      );
    }

    // ── Paso 4: verificar usuarios del departamento ───────
    const usuarios = await this.prisma.usuario.findMany({
      where:  { id_usuario: { in: dto.id_usuarios } },
      select: { id_usuario: true, nombre: true, id_departamento: true },
    });

    // 4a — Verificar que todos los IDs existen
    if (usuarios.length !== dto.id_usuarios.length) {
      const encontrados   = new Set(usuarios.map((u) => u.id_usuario));
      const noEncontrados = dto.id_usuarios.filter((id) => !encontrados.has(id));
      throw new BadRequestException(
        `Los siguientes ID de usuario no existen: [${noEncontrados.join(', ')}].`,
      );
    }

    // 4b — Verificar que todos pertenecen al departamento de la malla
    const fueraDept = usuarios.filter(
      (u) => u.id_departamento !== malla.id_departamento,
    );
    if (fueraDept.length > 0) {
      const detalle = fueraDept
        .map((u) => `${u.id_usuario} (${u.nombre})`)
        .join(', ');
      throw new BadRequestException(
        `Los siguientes usuarios no pertenecen al departamento "${malla.departamento.nombre}": [${detalle}].`,
      );
    }

    // ── Paso 5: construir fechas del período ──────────────
    const fechas      = buildFechas(malla.periodo_inicio, malla.periodo_fin);
    const total_dias     = fechas.length;
    const total_usuarios = dto.id_usuarios.length;

    // ── Paso 6: detectar duplicados existentes ────────────
    // Clave de unicidad: `{id_usuario}-{YYYY-MM-DD}`
    const existentes = await this.prisma.turno.findMany({
      where: {
        id_malla:   dto.id_malla,
        id_usuario: { in: dto.id_usuarios },
      },
      select: { id_usuario: true, fecha: true },
    });

    const existentesSet = new Set(
      existentes.map(
        (t) => `${t.id_usuario}-${t.fecha.toISOString().slice(0, 10)}`,
      ),
    );

    // ── Paso 7: construir registros nuevos ────────────────
    const turnosNuevos: Prisma.TurnoCreateManyInput[] = [];

    for (const fecha of fechas) {
      const fechaKey = fecha.toISOString().slice(0, 10);
      for (const id_usuario of dto.id_usuarios) {
        if (!existentesSet.has(`${id_usuario}-${fechaKey}`)) {
          turnosNuevos.push({
            fecha,
            hora_inicio:    plantilla.hora_inicio,
            hora_fin:       plantilla.hora_fin,
            estado:         EstadoTurno.Pendiente,
            cst_conflicto:  false,  // T-05 evaluará los conflictos CST
            cst_detalle:    null,
            id_malla:       malla.id_malla,
            id_usuario,
            id_departamento: malla.id_departamento,
          });
        }
      }
    }

    // ── Paso 8: persistir y retornar resumen ──────────────
    const total_omitidos = total_dias * total_usuarios - turnosNuevos.length;

    if (turnosNuevos.length > 0) {
      await this.prisma.turno.createMany({ data: turnosNuevos });
    }

    return {
      total_dias,
      total_usuarios,
      total_generados: turnosNuevos.length,
      total_omitidos,
      malla: {
        id_malla:       malla.id_malla,
        estado:         malla.estado,
        periodo_inicio: malla.periodo_inicio,
        periodo_fin:    malla.periodo_fin,
        departamento:   malla.departamento.nombre,
      },
      plantilla: {
        id_plantilla: plantilla.id_plantilla,
        nombre:       plantilla.nombre,
        hora_inicio:  plantilla.hora_inicio,
        hora_fin:     plantilla.hora_fin,
      },
    };
  }
}