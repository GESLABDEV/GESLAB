import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoMalla, Rol } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { MallaAccion, TransitionScheduleDto } from './dto/transition-schedule.dto';

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

// ─── Selects reutilizables ─────────────────────────────────
const USUARIO_SELECT = {
  id_usuario: true,
  nombre:     true,
  email:      true,
  rol:        true,
};

const DEPARTAMENTO_SELECT = {
  id_departamento: true,
  nombre:          true,
};

type ReglaTransicion = { desde: EstadoMalla[]; hacia: EstadoMalla };

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── GUARD: solo SA o ADM Global puede escribir ───────────
  private assertPuedeEscribir(caller: Caller): void {
    if (caller.rol === Rol.SA) return;
    if (caller.rol === Rol.ADM && caller.acceso_global) return;
    throw new ForbiddenException(
      'Solo un Administrador Global puede crear, editar o eliminar mallas.',
    );
  }

  // ─── SCOPING: where clause por rol ───────────────────────
  // SA y ADM Global ven todo; ADM Depto solo su departamento.
  // MOD/AGE no llegan aquí porque @Roles los bloquea en el controller.
  private buildWhereClause(caller: Caller): object {
    if (caller.rol === Rol.SA || caller.acceso_global) return {};
    if (caller.rol === Rol.ADM) {
      return { id_departamento: caller.id_departamento };
    }
    throw new ForbiddenException('No tiene acceso al módulo de mallas.');
  }

  // ─── GUARD: periodo_fin > periodo_inicio ──────────────────
  private assertPeriodoValido(inicio: Date, fin: Date): void {
    if (fin <= inicio) {
      throw new BadRequestException(
        'periodo_fin debe ser posterior a periodo_inicio.',
      );
    }
  }

  // ─── MAPA DE TRANSICIONES ─────────────────────────────────
private static readonly TRANSICIONES: Record<MallaAccion, ReglaTransicion> = {
    [MallaAccion.Submit]:   { desde: [EstadoMalla.Borrador],  hacia: EstadoMalla.Propuesta },
    [MallaAccion.Adjust]:   { desde: [EstadoMalla.Propuesta], hacia: EstadoMalla.Ajustando },
    [MallaAccion.Resubmit]: { desde: [EstadoMalla.Ajustando], hacia: EstadoMalla.Propuesta },
    [MallaAccion.Reject]:   { desde: [EstadoMalla.Propuesta], hacia: EstadoMalla.Rechazada },
    [MallaAccion.Publish]:  { desde: [EstadoMalla.Propuesta], hacia: EstadoMalla.Publicada },
  };

  // ─── FIND ALL ─────────────────────────────────────────────
  async findAll(caller: Caller) {
    const where = this.buildWhereClause(caller);
    return this.prisma.malla.findMany({
      where,
      include: {
        departamento: { select: DEPARTAMENTO_SELECT },
        creador:      { select: USUARIO_SELECT },
        aprobador:    { select: USUARIO_SELECT },
        _count:       { select: { turnos: true } },
      },
      orderBy: [{ estado: 'asc' }, { periodo_inicio: 'desc' }],
    });
  }

  // ─── FIND ONE ─────────────────────────────────────────────
  // Usa findFirst para combinar id + scoping de departamento.
  // Si el caller no tiene acceso a esa malla, retorna 404 (no revela existencia).
  async findOne(id: number, caller: Caller) {
    const where = { id_malla: id, ...this.buildWhereClause(caller) };
    const malla = await this.prisma.malla.findFirst({
      where,
      include: {
        departamento: { select: DEPARTAMENTO_SELECT },
        creador:      { select: USUARIO_SELECT },
        aprobador:    { select: USUARIO_SELECT },
        turnos:       true,
      },
    });
    if (!malla) {
      throw new NotFoundException(`Malla con ID ${id} no encontrada.`);
    }
    return malla;
  }

  // ─── CREATE ───────────────────────────────────────────────
  async create(dto: CreateScheduleDto, caller: Caller) {
    this.assertPuedeEscribir(caller);

    const inicio = new Date(dto.periodo_inicio);
    const fin    = new Date(dto.periodo_fin);
    this.assertPeriodoValido(inicio, fin);

    const dept = await this.prisma.departamento.findUnique({
      where: { id_departamento: dto.id_departamento },
    });
    if (!dept) {
      throw new BadRequestException(
        `Departamento con ID ${dto.id_departamento} no encontrado.`,
      );
    }

    return this.prisma.malla.create({
      data: {
        periodo_inicio:  inicio,
        periodo_fin:     fin,
        frecuencia:      dto.frecuencia,
        estado:          EstadoMalla.Borrador,
        id_departamento: dto.id_departamento,
        id_creador:      caller.id_usuario,
      },
      include: {
        departamento: { select: DEPARTAMENTO_SELECT },
        creador:      { select: USUARIO_SELECT },
      },
    });
  }

  // ─── UPDATE ───────────────────────────────────────────────
  async update(id: number, dto: UpdateScheduleDto, caller: Caller) {
    this.assertPuedeEscribir(caller);

    // assertPuedeEscribir garantiza que caller es SA o ADM Global,
    // por lo que buildWhereClause retorna {} y findOne no aplica scoping adicional.
    const before = await this.findOne(id, caller);

    const estadosEditables: EstadoMalla[] = [EstadoMalla.Borrador, EstadoMalla.Ajustando];
    if (!estadosEditables.includes(before.estado)) {
      throw new BadRequestException(
        `No se puede editar una malla en estado "${before.estado}". ` +
        `Solo es editable en estado Borrador o Ajustando.`,
      );
    }

    const inicio = dto.periodo_inicio ? new Date(dto.periodo_inicio) : before.periodo_inicio;
    const fin    = dto.periodo_fin    ? new Date(dto.periodo_fin)    : before.periodo_fin;
    this.assertPeriodoValido(inicio, fin);

    if (dto.id_departamento !== undefined) {
      const dept = await this.prisma.departamento.findUnique({
        where: { id_departamento: dto.id_departamento },
      });
      if (!dept) {
        throw new BadRequestException(
          `Departamento con ID ${dto.id_departamento} no encontrado.`,
        );
      }
    }

    const after = await this.prisma.malla.update({
      where: { id_malla: id },
      data: {
        ...(dto.periodo_inicio  !== undefined && { periodo_inicio:  new Date(dto.periodo_inicio) }),
        ...(dto.periodo_fin     !== undefined && { periodo_fin:     new Date(dto.periodo_fin) }),
        ...(dto.frecuencia      !== undefined && { frecuencia:      dto.frecuencia }),
        ...(dto.id_departamento !== undefined && { id_departamento: dto.id_departamento }),
      },
      include: {
        departamento: { select: DEPARTAMENTO_SELECT },
        creador:      { select: USUARIO_SELECT },
        aprobador:    { select: USUARIO_SELECT },
      },
    });

    return { before, after };
  }

  // ─── DELETE ───────────────────────────────────────────────
  async remove(id: number, caller: Caller) {
    this.assertPuedeEscribir(caller);

    const malla = await this.findOne(id, caller);

    if (malla.estado !== EstadoMalla.Borrador) {
      throw new BadRequestException(
        `Solo se pueden eliminar mallas en estado Borrador. ` +
        `Estado actual: "${malla.estado}".`,
      );
    }

    return this.prisma.malla.delete({ where: { id_malla: id } });
  }

  // ─── TRANSITION ───────────────────────────────────────────
  async transition(id: number, dto: TransitionScheduleDto, caller: Caller) {
    this.assertPuedeEscribir(caller);

    const malla = await this.findOne(id, caller);
    const regla = SchedulesService.TRANSICIONES[dto.accion];

    if (!regla.desde.includes(malla.estado)) {
      throw new BadRequestException(
        `La acción "${dto.accion}" no es válida desde el estado "${malla.estado}". ` +
        `Estado(s) válido(s) para esta acción: ${regla.desde.join(', ')}.`,
      );
    }

    // ── Validación CST para publish ────────────────────────
    // T-06 implementará la lógica completa. Aquí: bloquear si existen
    // turnos con cst_conflicto=true asociados a esta malla.
    if (dto.accion === MallaAccion.Publish) {
      const conflictos = await this.prisma.turno.count({
        where: { id_malla: id, cst_conflicto: true },
      });
      if (conflictos > 0) {
        throw new BadRequestException(
          `No se puede publicar la malla: ${conflictos} turno(s) tienen conflictos CST. ` +
          `Resuelva los conflictos antes de publicar.`,
        );
      }
    }

    return this.prisma.malla.update({
      where: { id_malla: id },
      data: {
        estado: regla.hacia,
        ...(dto.accion === MallaAccion.Publish && {
          fecha_publicacion: new Date(),
          id_aprobador:      caller.id_usuario,
        }),
      },
      include: {
        departamento: { select: DEPARTAMENTO_SELECT },
        creador:      { select: USUARIO_SELECT },
        aprobador:    { select: USUARIO_SELECT },
      },
    });
  }
}