import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { buildPaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Rol } from '@prisma/client';

// Select reutilizable para el objeto administrador en responses
const ADMIN_SELECT = {
  id_usuario: true,
  nombre:     true,
  email:      true,
  rol:        true,
};

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── HELPER: validar que el usuario sea ADM activo y sin depto asignado ───
  // excludeDeptoId: al hacer update, excluir el depto actual del chequeo 1:1
  private async validarAdministrador(
    id_administrador: number,
    excludeDeptoId?: number,
  ): Promise<void> {
    // 1. Verificar que el usuario existe y tiene rol ADM activo
    const admin = await this.prisma.usuario.findUnique({
      where:  { id_usuario: id_administrador },
      select: { id_usuario: true, nombre: true, rol: true, activo: true },
    });

    if (!admin) {
      throw new NotFoundException(
        `Usuario con ID ${id_administrador} no encontrado.`,
      );
    }
    if (admin.rol !== Rol.ADM) {
      throw new BadRequestException(
        `El administrador del departamento debe tener rol ADM. ` +
        `El usuario seleccionado tiene rol ${admin.rol}.`,
      );
    }
    if (!admin.activo) {
      throw new BadRequestException(
        `El usuario ${admin.nombre} está inactivo y no puede ser asignado como administrador.`,
      );
    }

    // 2. ✅ RN-DEPT-001: verificar que el ADM no administra ya otro departamento
    const deptoExistente = await this.prisma.departamento.findFirst({
      where: {
        id_administrador,
        // En update: ignorar el departamento que ya lo tiene asignado
        ...(excludeDeptoId && {
          NOT: { id_departamento: excludeDeptoId },
        }),
      },
      select: { id_departamento: true, nombre: true },
    });

    if (deptoExistente) {
      throw new ConflictException(
        `${admin.nombre} ya administra el departamento "${deptoExistente.nombre}". ` +
        `Un ADM solo puede administrar un departamento.`,
      );
    }
  }

  // ─── FIND ALL ──────────────────────────────────────────────
  async findAll(dto: PaginationDto) {
    const { page = 1, limit = 20, search } = dto;
    const skip = (page - 1) * limit;
    const where = search
      ? { nombre: { contains: search, mode: 'insensitive' as const } }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.departamento.findMany({
        where,
        include: {
          administrador: { select: ADMIN_SELECT },
          usuarios: {
            where:  { activo: true },
            select: { id_usuario: true, nombre: true, email: true, rol: true },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.departamento.count({ where }),
    ]);
    return buildPaginatedResponse(data, total, page, limit);
  }

  // ─── FIND ONE ──────────────────────────────────────────────
  async findOne(id: number) {
    const dept = await this.prisma.departamento.findUnique({
      where: { id_departamento: id },
      include: {
        administrador: { select: ADMIN_SELECT },
        usuarios: {
          where:  { activo: true },
          select: { id_usuario: true, nombre: true, email: true, rol: true },
        },
      },
    });
    if (!dept) throw new NotFoundException(`Departamento ${id} no encontrado`);
    return dept;
  }

  // ─── CREATE ───────────────────────────────────────────────
  async create(dto: CreateDepartmentDto) {
    if (dto.id_administrador) {
      // Sin excludeDeptoId — es creación, cualquier conflicto bloquea
      await this.validarAdministrador(dto.id_administrador);
    }

    return this.prisma.departamento.create({
      data: {
        nombre: dto.nombre,
        ...(dto.id_administrador && { id_administrador: dto.id_administrador }),
      },
      // ✅ Incluir objeto administrador en la respuesta
      include: {
        administrador: { select: ADMIN_SELECT },
      },
    });
  }

  // ─── UPDATE ───────────────────────────────────────────────
  async update(id: number, dto: UpdateDepartmentDto) {
    await this.findOne(id);

    if (dto.id_administrador !== undefined && dto.id_administrador !== null) {
      // excludeDeptoId: este mismo depto no cuenta como conflicto
      await this.validarAdministrador(dto.id_administrador, id);
    }

    return this.prisma.departamento.update({
      where: { id_departamento: id },
      data: {
        ...(dto.nombre && { nombre: dto.nombre }),
        ...(dto.id_administrador !== undefined && { id_administrador: dto.id_administrador }),
      },
      // ✅ Incluir objeto administrador en la respuesta
      include: {
        administrador: { select: ADMIN_SELECT },
      },
    });
  }

  // ─── REMOVE ───────────────────────────────────────────────
  async remove(id: number) {
    await this.findOne(id);
    const activeUsers = await this.prisma.usuario.count({
      where: { id_departamento: id, activo: true },
    });
    if (activeUsers > 0) {
      throw new ConflictException(
        `No se puede eliminar: el departamento tiene ${activeUsers} usuario(s) activo(s)`,
      );
    }
    return this.prisma.departamento.delete({ where: { id_departamento: id } });
  }
}