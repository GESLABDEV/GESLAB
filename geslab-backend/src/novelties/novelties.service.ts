import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';

@Injectable()
export class NoveltiesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CREATE ───────────────────────────────────────────────
  async create(dto: CreateNoveltyDto, registradoPorId: number) {
    // 1. Verificar que el usuario afectado existe y está activo
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: dto.id_usuario },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario ${dto.id_usuario} no encontrado.`);
    }
    if (!usuario.activo) {
      throw new ConflictException(
        'No se puede registrar novedad a un usuario inactivo.',
      );
    }

    // 2. Validar solapamiento de fechas para el mismo usuario
    const overlap = await this.prisma.novedad.findFirst({
      where: {
        id_usuario: dto.id_usuario,
        estado: { in: ['Registrada', 'Activa'] },
        AND: [
          { fecha_inicio: { lte: new Date(dto.fecha_fin) } },
          { fecha_fin:    { gte: new Date(dto.fecha_inicio) } },
        ],
      },
    });
    if (overlap) {
      throw new ConflictException(
        'El colaborador ya tiene una novedad activa en ese período.',
      );
    }

    // 3. Crear
    return this.prisma.novedad.create({
      data: {
        tipo:              dto.tipo,
        fecha_inicio:      new Date(dto.fecha_inicio),
        fecha_fin:         new Date(dto.fecha_fin),
        descripcion:       dto.descripcion,
        soporte_url:       dto.soporte_url,
        id_usuario:        dto.id_usuario,
        id_registrado_por: registradoPorId,
      },
    });
  }

  // ─── FIND ALL ──────────────────────────────────────────────
  async findAll(
    page = 1,
    limit = 20,
    tipo?: string,
    id_usuario?: number,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { NOT: { estado: 'Eliminada' } };
    if (tipo)       where.tipo       = tipo;
    if (id_usuario) where.id_usuario = id_usuario;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.novedad.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' },
        include: {
          afectado:       { select: { id_usuario: true, nombre: true, email: true } },
          registrado_por: { select: { id_usuario: true, nombre: true } },
        },
      }),
      this.prisma.novedad.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── FIND TEAM (MOD) ───────────────────────────────────────
  async findTeam(moderadorId: number) {
    return this.prisma.novedad.findMany({
      where: {
        estado: { in: ['Registrada', 'Activa'] },
        afectado: { id_moderador: moderadorId },
      },
      orderBy: { fecha_inicio: 'asc' },
      include: {
        afectado: { select: { id_usuario: true, nombre: true, email: true } },
      },
    });
  }

  // ─── FIND ONE ──────────────────────────────────────────────
  async findOne(id: number) {
    const novedad = await this.prisma.novedad.findUnique({
      where: { id_novedad: id },
      include: {
        afectado:       { select: { id_usuario: true, nombre: true, email: true } },
        registrado_por: { select: { id_usuario: true, nombre: true } },
      },
    });
    if (!novedad) {
      throw new NotFoundException(`Novedad ${id} no encontrada.`);
    }
    return novedad;
  }

  // ─── UPDATE ───────────────────────────────────────────────
  async update(id: number, dto: UpdateNoveltyDto) {
    const novedad = await this.findOne(id);

    // No editar si fecha_inicio ya pasó
    if (new Date(novedad.fecha_inicio) <= new Date()) {
      throw new UnprocessableEntityException(
        'No se puede editar una novedad cuya fecha de inicio ya ocurrió.',
      );
    }

    return this.prisma.novedad.update({
      where: { id_novedad: id },
      data: {
        ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio) }),
        ...(dto.fecha_fin    && { fecha_fin:    new Date(dto.fecha_fin) }),
        ...(dto.descripcion  && { descripcion:  dto.descripcion }),
        ...(dto.soporte_url !== undefined && { soporte_url: dto.soporte_url }),
      },
    });
  }

  // ─── REMOVE (soft delete) ──────────────────────────────────
  async remove(id: number) {
    const novedad = await this.findOne(id);

    if (novedad.estado === 'Eliminada') {
      throw new ConflictException('La novedad ya fue eliminada.');
    }

    return this.prisma.novedad.update({
      where: { id_novedad: id },
      data: { estado: 'Eliminada' },
    });
  }
}