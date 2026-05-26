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

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

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
    page = 1,
    limit = 20,
    tipo?: string,
    estado?: string,
    id_usuario?: number,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tipo)       where.tipo            = tipo;
    if (estado)     where.estado          = estado;
    if (id_usuario) where.id_solicitante  = id_usuario;

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
    const skip = (page - 1) * limit;
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
  async findOne(id: number, usuario: any) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id_solicitud: id },
      include: {
        solicitante:       { select: { id_usuario: true, nombre: true, rol: true } },
        revisor_moderador: { select: { id_usuario: true, nombre: true } },
        aprobador:         { select: { id_usuario: true, nombre: true } },
      },
    });

    if (!solicitud) throw new NotFoundException(`Solicitud ${id} no encontrada.`);

    if (
      usuario.rol === Rol.AGE &&
      solicitud.id_solicitante !== usuario.id_usuario
    ) {
      throw new ForbiddenException('Solo puedes ver tus propias solicitudes.');
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
  async decide(id: number, dto: DecideRequestDto, decisor: any) {
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

    // dto.comentario ya viene validado por el DTO (obligatorio, solo letras)
    return this.prisma.solicitud.update({
      where: { id_solicitud: id },
      data: {
        estado:       dto.estado,
        comentario:   dto.comentario,
        id_aprobador: decisor.id_usuario,
      },
    });
  }
}