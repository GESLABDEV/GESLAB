import {
  BadRequestException,
  ConflictException,
  ForbiddenException, // ✅ SC — nuevo
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rol } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// ✅ B1 — Mapa de jerarquía: rol del usuario → rol requerido del supervisor
const ROL_SUPERVISOR_REQUERIDO: Partial<Record<Rol, Rol>> = {
  [Rol.AGE]: Rol.MOD,
  [Rol.MOD]: Rol.ADM,
  [Rol.ADM]: Rol.SA,
};

// ✅ SC — Tipo del caller inyectado desde @CurrentUser()
interface Caller {
  id_usuario:      number;
  rol:             Rol;
  acceso_global:   boolean;
  id_departamento: number | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── HELPER SC: validar que el objetivo pertenece al depto del caller ──
  // Solo aplica a ADM sin acceso global. SA y ADM Global pasan sin restricción.
  private async validarScopeDepto(
    id_usuario_objetivo: number,
    caller: Caller,
  ): Promise<void> {
    if (caller.rol === Rol.SA)    return; // SA siempre tiene acceso total
    if (caller.acceso_global)     return; // ADM Global sin restricción

    if (!caller.id_departamento) {
      throw new BadRequestException(
        'No tienes un departamento asignado. Contacta al SA.',
      );
    }

    const objetivo = await this.prisma.usuario.findUnique({
      where:  { id_usuario: id_usuario_objetivo },
      select: { id_departamento: true },
    });

    if (!objetivo) {
      throw new NotFoundException(
        `Usuario con ID ${id_usuario_objetivo} no encontrado.`,
      );
    }

    if (objetivo.id_departamento !== caller.id_departamento) {
      throw new ForbiddenException(
        'No puedes gestionar usuarios fuera de tu departamento.',
      );
    }
  }

  // ─── CREATE ───────────────────────────────────────────────
  async create(dto: CreateUserDto, caller: Caller) {
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException(`El email ${dto.email} ya está registrado.`);
    }

    // ✅ SC — ADM sin acceso global solo puede crear usuarios en su depto
    let id_departamento = dto.id_departamento ?? null;
    if (caller.rol === Rol.ADM && !caller.acceso_global) {
      if (!caller.id_departamento) {
        throw new BadRequestException(
          'No tienes un departamento asignado. Contacta al SA.',
        );
      }
      // Forzar el depto del caller — ignora lo que venga en el DTO
      id_departamento = caller.id_departamento;
    }

    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre:          dto.nombre,
        email:           dto.email,
        contrasena_hash: hashedPassword,
        rol:             dto.rol,
        id_departamento,
      },
    });

    return this.sanitize(user);
  }

  // ─── FIND ALL (paginado) ───────────────────────────────────
  async findAll(caller: Caller, page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;

    // ✅ SC — ADM sin acceso global solo ve su depto
    const scopeWhere: any = {};
    if (caller.rol === Rol.ADM && !caller.acceso_global) {
      if (!caller.id_departamento) {
        throw new BadRequestException(
          'No tienes un departamento asignado. Contacta al SA.',
        );
      }
      scopeWhere.id_departamento = caller.id_departamento;
    }

    const where: any = search
      ? {
          ...scopeWhere,
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { email:  { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : scopeWhere;

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
          id_moderador:    true,
          creado_en:       true,
        },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

// ─── FIND ONE ──────────────────────────────────────────────
async findOne(id: number, caller?: Caller) {
  // ✅ SC — solo aplica scope si viene caller (llamada externa)
  if (caller) {
    await this.validarScopeDepto(id, caller);
  }

  const user = await this.prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: {
      id_usuario:      true,
      nombre:          true,
      email:           true,
      rol:             true,
      activo:          true,
      id_departamento: true,
      id_moderador:    true,
      creado_en:       true,
    },
  });

  if (!user) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
  }
  return user;
}

  // ─── UPDATE ───────────────────────────────────────────────
  async update(id: number, dto: UpdateUserDto, caller: Caller) {
    // ✅ SC — validar que el objetivo pertenece al depto del caller
    await this.validarScopeDepto(id, caller);

    // 1. Leer usuario actual — fuente de verdad del rol actual
    const usuarioActual = await this.findOne(id);

    // 2. Rol efectivo
    const rolEfectivo: Rol = (dto.rol as Rol) ?? usuarioActual.rol;

    // 3. Validar jerarquía de supervisor si viene id_moderador
    if (dto.id_moderador !== undefined && dto.id_moderador !== null) {
      if (rolEfectivo === Rol.SA) {
        throw new BadRequestException(
          'Un usuario con rol SA no puede tener supervisor.',
        );
      }

      const rolSupervisorRequerido = ROL_SUPERVISOR_REQUERIDO[rolEfectivo];

      const supervisor = await this.prisma.usuario.findUnique({
        where:  { id_usuario: dto.id_moderador },
        select: { id_usuario: true, nombre: true, rol: true, activo: true },
      });

      if (!supervisor) {
        throw new BadRequestException(
          `El usuario id=${dto.id_moderador} no existe.`,
        );
      }

      if (supervisor.rol !== rolSupervisorRequerido) {
        throw new BadRequestException(
          `El supervisor de un ${rolEfectivo} debe tener rol ${rolSupervisorRequerido}. ` +
          `El usuario seleccionado tiene rol ${supervisor.rol}.`,
        );
      }
    }

    // 4. Aplicar actualización
    const updated = await this.prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        ...(dto.nombre          && { nombre:          dto.nombre }),
        ...(dto.email           && { email:            dto.email }),
        ...(dto.rol             && { rol:              dto.rol }),
        ...(dto.id_departamento && { id_departamento:  dto.id_departamento }),
        ...(dto.id_moderador !== undefined && { id_moderador: dto.id_moderador }),
      },
    });

    return this.sanitize(updated);
  }

  // ─── DEACTIVATE (soft delete) ──────────────────────────────
  async deactivate(id: number, caller: Caller) {
    // ✅ SC — validar que el objetivo pertenece al depto del caller
    await this.validarScopeDepto(id, caller);
    await this.findOne(id);

    const updated = await this.prisma.usuario.update({
      where: { id_usuario: id },
      data:  { activo: false },
    });

    return {
      message: `Usuario ${updated.nombre} desactivado correctamente.`,
      id:      updated.id_usuario,
      activo:  updated.activo,
    };
  }

  // ─── ACTIVATE ─────────────────────────────────────────────
  async activate(id: number, caller: Caller) {
    // ✅ SC — validar que el objetivo pertenece al depto del caller
    await this.validarScopeDepto(id, caller);

    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    if (user.activo) {
      throw new ConflictException(
        `El usuario ${user.nombre} ya se encuentra activo.`,
      );
    }

    const updated = await this.prisma.usuario.update({
      where: { id_usuario: id },
      data:  { activo: true },
    });

    return {
      message: `Usuario ${updated.nombre} reactivado correctamente.`,
      id:      updated.id_usuario,
      activo:  updated.activo,
    };
  }

  // ─── HELPER: quitar contraseña del response ───────────────
  private sanitize(user: any) {
    const { contrasena_hash, ...safe } = user;
    return safe;
  }
}