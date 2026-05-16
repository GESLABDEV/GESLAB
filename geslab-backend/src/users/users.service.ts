import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CREATE ───────────────────────────────────────────────
  async create(dto: CreateUserDto) {
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException(`El email ${dto.email} ya está registrado.`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre:          dto.name,
        email:           dto.email,
        contrasena_hash:      hashedPassword,
        rol:             dto.role,
        id_departamento: dto.departmentId ?? null,
      },
    });

    return this.sanitize(user);
  }

  // ─── FIND ALL (paginado) ───────────────────────────────────
  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { email:  { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' },
        select: {
          id_usuario:      true,
          nombre:          true,
          email:           true,
          rol:             true,
          activo:          true,
          id_departamento: true,
          creado_en:       true,
        },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── FIND ONE ──────────────────────────────────────────────
  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario:      true,
        nombre:          true,
        email:           true,
        rol:             true,
        activo:          true,
        id_departamento: true,
        creado_en:       true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return user;
  }

  // ─── UPDATE ───────────────────────────────────────────────
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const updated = await this.prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        ...(dto.name         && { nombre:          dto.name }),
        ...(dto.email        && { email:            dto.email }),
        ...(dto.role         && { rol:              dto.role }),
        ...(dto.departmentId && { id_departamento:  dto.departmentId }),
      },
    });

    return this.sanitize(updated);
  }

  // ─── DEACTIVATE (soft delete) ──────────────────────────────
  async deactivate(id: number) {
    await this.findOne(id);

    const updated = await this.prisma.usuario.update({
      where: { id_usuario: id },
      data: { activo: false },
    });

    return {
      message:  `Usuario ${updated.nombre} desactivado correctamente.`,
      id:       updated.id_usuario,
      activo:   updated.activo,
    };
  }

  // ─── HELPER: quitar contraseña del response ───────────────
  private sanitize(user: any) {
    const { contrasena_hash, ...safe } = user;    
    return safe;
  }
}