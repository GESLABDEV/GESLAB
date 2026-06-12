import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { DecideRequestDto } from './dto/decide-request.dto';
import { Rol } from '@prisma/client';

// ✅ SC — Tipo del caller inyectado desde @CurrentUser()
interface Caller {
  id_usuario:      number;
  rol:             Rol;
  acceso_global:   boolean;
  id_departamento: number | null;
  id_moderador:    number | null;
}

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── HELPER SC: validar que el solicitante pertenece al depto del caller ──
  private async validarScopeSolicitud(
    id_solicitud: number,
    caller: Caller,
  ): Promise<void> {
    if (caller.rol === Rol.SA)  return;
    if (caller.acceso_global)   return;

    if (!caller.id_departamento) {
      throw new BadRequestException(
        'No tienes un departamento asignado. Contacta al SA.',
      );
    }

    const solicitud = await this.prisma.solicitud.findUnique({
      where:   { id_solicitud },
      select:  { solicitante: { select: { id_departamento: true } } },
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud ${id_solicitud} no encontrada.`);
    }

    if (solicitud.solicitante.id_departamento !== caller.id_departamento) {
      throw new ForbiddenException(
        'No puedes gestionar solicitudes fuera de tu departamento.',
      );
    }
  }

  // ─── CREAR — Flujos A (AGE), B (MOD), C (ADM) ─────────────
  async create(dto: CreateRequestDto, solicitante: any) {
    const { id_usuario, rol, id_moderador } = solicitante;

    let id_revisor_moderador: number | null = null;

    if (rol === Rol.AGE) {
      if (!id_moderador) {
        throw new BadRequestException(
          'El agente no tiene un Moderador asignado. Contacta al Administrador.',
        );
      }
      id_revisor_moderador = id_moderador;
    }

    return this.prisma.solicitud.create({
      data: {
        tipo:                dto.tipo,
        descripcion:         dto.descripcion,
        soporte_url:         dto.soporte_url,
        id_solicitante:      id_usuario,
        id_revisor_moderador,
        estado:              'Pendiente',
      },
    });
  }

  // ─── LISTAR TODAS (ADM / SA) ───────────────────────────────
  async findAll(
    caller: Caller,
    page    = 1,
    limit   = 20,
    tipo?:      string,
    estado?:    string,
    id_usuario?: number,
  ) {
    const skip = (page - 1) * limit;

    // ✅ SC — ADM sin acceso global solo ve solicitudes de su depto
    const scopeWhere: any = {};
    if (caller.rol === Rol.ADM && !caller.acceso_global) {
      if (!caller.id_departamento) {
        throw new BadRequestException(
          'No tienes un departamento asignado. Contacta al SA.',
        );
      }
      scopeWhere.solicitante = { id_departamento: caller.id_departamento };
    }

    const where: any = { ...scopeWhere };
    if (tipo)       where.tipo           = tipo;
    if (estado)     where.estado         = estado;
    if (id_usuario) where.id_solicitante = id_usuario;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.solicitud.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_solicitud: 'desc' },
        include: {
          solicitante:       { select: { id_usuario: true, nombre: true, rol: true } },
          revisor_moderador: { select: { id_usuario: true, nombre: true } },
          aprobador:         { select: { id_usuario: true, nombre: true } },
        },
      }),
      this.prisma.solicitud.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── MIS SOLICITUDES (AGE / MOD / ADM) ────────────────────
  async findMy(userId: number, page = 1, limit = 20) {
    const skip  = (page - 1) * limit;
    const where = { id_solicitante: userId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.solicitud.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_solicitud: 'desc' },
      }),
      this.prisma.solicitud.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── SOLICITUDES PENDIENTES DEL EQUIPO (MOD) ──────────────
  async findPendingReview(moderadorId: number) {
    return this.prisma.solicitud.findMany({
      where: {
        id_revisor_moderador: moderadorId,
        estado:               'Pendiente',
      },
      orderBy: { fecha_solicitud: 'asc' },
      include: {
        solicitante: { select: { id_usuario: true, nombre: true, email: true } },
      },
    });
  }

  // ─── VER DETALLE ───────────────────────────────────────────
async findOne(id: number, caller: any) {
  console.log('[findOne] caller.rol:', caller.rol, '| tipo:', typeof caller.rol);
  console.log('[findOne] Rol.AGE:', Rol.AGE, '| iguales:', caller.rol === Rol.AGE);
  // ... resto del método
    // ✅ SC — AGE solo ve las suyas (comportamiento original)
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id_solicitud: id },
      include: {
        solicitante:       { select: { id_usuario: true, nombre: true, rol: true, id_departamento: true } },
        revisor_moderador: { select: { id_usuario: true, nombre: true } },
        aprobador:         { select: { id_usuario: true, nombre: true } },
      },
    });

    if (!solicitud) throw new NotFoundException(`Solicitud ${id} no encontrada.`);

    // AGE — solo las suyas
    if (caller.rol === Rol.AGE && solicitud.id_solicitante !== caller.id_usuario) {
      throw new ForbiddenException('Solo puedes ver tus propias solicitudes.');
    }

    // MOD — solo sus solicitudes propias + las que él revisa (RN-MOD-001)
if (caller.rol === Rol.MOD) {
  const esSuya    = solicitud.id_solicitante       === caller.id_usuario;
  const esRevisor = solicitud.id_revisor_moderador === caller.id_usuario;
  if (!esSuya && !esRevisor) {
    throw new ForbiddenException(
      'Solo puedes ver tus propias solicitudes o las de tu equipo.',
    );
  }
}

    // ✅ SC — ADM sin acceso global solo ve solicitudes de su depto
    if (caller.rol === Rol.ADM && !caller.acceso_global) {
      if (solicitud.solicitante.id_departamento !== caller.id_departamento) {
        throw new ForbiddenException(
          'No puedes ver solicitudes fuera de tu departamento.',
        );
      }
    }

    return solicitud;
  }

  // ─── REVISAR (MOD) → EnRevision ───────────────────────────
  async review(id: number, dto: ReviewRequestDto, moderador: any) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id_solicitud: id },
    });

    if (!solicitud) throw new NotFoundException(`Solicitud ${id} no encontrada.`);

    if (solicitud.estado !== 'Pendiente') {
      throw new BadRequestException(
        `La solicitud ya está en estado "${solicitud.estado}". Solo se pueden revisar solicitudes Pendientes.`,
      );
    }

    if (solicitud.id_revisor_moderador !== moderador.id_usuario) {
      throw new ForbiddenException('Esta solicitud no pertenece a tu equipo.');
    }

    return this.prisma.solicitud.update({
      where: { id_solicitud: id },
      data: {
        estado:               'EnRevision',
        comentario_moderador: dto.comentario_moderador,
      },
    });
  }

  // ─── DECIDIR (ADM / SA) → Aprobada | Rechazada ────────────
  async decide(id: number, dto: DecideRequestDto, decisor: Caller) {
    // ✅ SC — ADM sin acceso global solo decide sobre su depto
    await this.validarScopeSolicitud(id, decisor);

    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id_solicitud: id },
    });

    if (!solicitud) throw new NotFoundException(`Solicitud ${id} no encontrada.`);

    const estadoActual = solicitud.estado;

    // Flujo A: tiene revisor → OBLIGATORIO pasar por EnRevision
    if (solicitud.id_revisor_moderador !== null && estadoActual !== 'EnRevision') {
      throw new BadRequestException(
        'Esta solicitud requiere revisión del Moderador antes de ser decidida (Flujo A).',
      );
    }

    // Flujos B y C: sin revisor → debe estar en Pendiente
    if (solicitud.id_revisor_moderador === null && estadoActual !== 'Pendiente') {
      throw new BadRequestException(
        `La solicitud ya fue procesada (estado: "${estadoActual}").`,
      );
    }

    return this.prisma.solicitud.update({
      where: { id_solicitud: id },
      data: {
        estado:       dto.estado,
        comentario:   dto.comentario,
        id_aprobador: decisor.id_usuario,
      },
    });
  }

  async findPendingMod(caller: Caller) {
  // Scope: ADM depto filtra por su departamento
  const solicitanteWhere: any = { rol: Rol.MOD };
  if (caller.rol === Rol.ADM && !caller.acceso_global) {
    if (!caller.id_departamento) {
      throw new BadRequestException(
        'No tienes un departamento asignado. Contacta al SA.',
      );
    }
    solicitanteWhere.id_departamento = caller.id_departamento;
  }

  return this.prisma.solicitud.findMany({
    where: {
      estado:               'Pendiente',
      id_revisor_moderador: null,       // solo Flujo B
      solicitante:          solicitanteWhere,
    },
    orderBy: { fecha_solicitud: 'asc' },
    include: {
      solicitante: {
        select: {
          id_usuario:      true,
          nombre:          true,
          email:           true,
          id_departamento: true,
        },
      },
    },
  });
}
}