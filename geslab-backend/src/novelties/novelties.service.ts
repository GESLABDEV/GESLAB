import {
  BadRequestException,
  ConflictException,
  ForbiddenException, // ✅ SC
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
import { Rol } from '@prisma/client'; // ✅ SC

// ✅ SC — Tipo del caller inyectado desde @CurrentUser()
interface Caller {
  id_usuario:      number;
  rol:             Rol;
  acceso_global:   boolean;
  id_departamento: number | null;
}

@Injectable()
export class NoveltiesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── HELPER SC: validar que el afectado pertenece al depto del caller ──
  // Usado en create() — verifica el usuario objetivo antes de crear
  private async validarScopeUsuario(
    id_usuario: number,
    caller: Caller,
  ): Promise<void> {
    if (caller.rol === Rol.SA) return;
    if (caller.acceso_global)  return;

    if (!caller.id_departamento) {
      throw new BadRequestException(
        'No tienes un departamento asignado. Contacta al SA.',
      );
    }

    const usuario = await this.prisma.usuario.findUnique({
      where:  { id_usuario },
      select: { id_departamento: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario ${id_usuario} no encontrado.`);
    }

    if (usuario.id_departamento !== caller.id_departamento) {
      throw new ForbiddenException(
        'No puedes registrar novedades a usuarios fuera de tu departamento.',
      );
    }
  }

  // ─── HELPER SC: validar que la novedad pertenece al depto del caller ──
  // Usado en update() y remove()
  private async validarScopeNovedad(
    id_novedad: number,
    caller: Caller,
  ): Promise<void> {
    if (caller.rol === Rol.SA)  return;
    if (caller.rol === Rol.MOD) return; // MOD accede a findOne — sin restricción
    if (caller.acceso_global)   return;

    if (!caller.id_departamento) {
      throw new BadRequestException(
        'No tienes un departamento asignado. Contacta al SA.',
      );
    }

    const novedad = await this.prisma.novedad.findUnique({
      where:  { id_novedad },
      select: { afectado: { select: { id_departamento: true } } },
    });

    if (!novedad) {
      throw new NotFoundException(`Novedad ${id_novedad} no encontrada.`);
    }

    if (novedad.afectado.id_departamento !== caller.id_departamento) {
      throw new ForbiddenException(
        'No puedes gestionar novedades fuera de tu departamento.',
      );
    }
  }

  // ─── CREATE ───────────────────────────────────────────────
async create(dto: CreateNoveltyDto, caller: Caller) {
  // ✅ RN-NOV-001 — Solo SA y ADM Global gestionan novedades directamente
  if (caller.rol === Rol.ADM && !caller.acceso_global) {
    throw new ForbiddenException(
      'Solo el administrador global puede registrar novedades.',
    );
  }
    await this.validarScopeUsuario(dto.id_usuario, caller);

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

    // 2. Validar solapamiento de fechas
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
        id_registrado_por: caller.id_usuario, // ✅ SC — viene del caller completo
      },
    });
  }

  // ─── FIND ALL ──────────────────────────────────────────────
  async findAll(
    caller: Caller,
    page    = 1,
    limit   = 20,
    tipo?:      string,
    id_usuario?: number,
  ) {
    const skip = (page - 1) * limit;

    // ✅ SC — ADM sin acceso global solo ve novedades de su depto
    const scopeAfectado: any = {};
    if (caller.rol === Rol.ADM && !caller.acceso_global) {
      if (!caller.id_departamento) {
        throw new BadRequestException(
          'No tienes un departamento asignado. Contacta al SA.',
        );
      }
      scopeAfectado.afectado = { id_departamento: caller.id_departamento };
    }

    const where: any = {
      NOT: { estado: 'Eliminada' },
      ...scopeAfectado,
    };
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

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── FIND TEAM (MOD) ───────────────────────────────────────
  async findTeam(moderadorId: number) {
    return this.prisma.novedad.findMany({
      where: {
        estado:   { in: ['Registrada', 'Activa'] },
        afectado: { id_moderador: moderadorId },
      },
      orderBy: { fecha_inicio: 'asc' },
      include: {
        afectado: { select: { id_usuario: true, nombre: true, email: true } },
      },
    });
  }

  // ─── FIND ONE ──────────────────────────────────────────────
  async findOne(id: number, caller?: Caller) {
    // ✅ SC — validar scope si viene caller (llamada externa)
    if (caller) {
      await this.validarScopeNovedad(id, caller);
    }

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
async update(id: number, dto: UpdateNoveltyDto, caller: Caller) {
  // ✅ RN-NOV-001
  if (caller.rol === Rol.ADM && !caller.acceso_global) {
    throw new ForbiddenException(
      'Solo el administrador global puede modificar novedades.',
    );
  }
    await this.validarScopeNovedad(id, caller);

    const novedad = await this.findOne(id); // sin caller — scope ya validado

    // ✅ B5 — Bloque A: fechas
    const quiereCambiarFechas = dto.fecha_inicio || dto.fecha_fin;
    const fechaInicioPasada   = new Date(novedad.fecha_inicio) <= new Date();

    if (quiereCambiarFechas && fechaInicioPasada) {
      throw new UnprocessableEntityException(
        'No se pueden modificar las fechas de una novedad cuya fecha de inicio ya ocurrió.',
      );
    }

    // ✅ B5 — Bloque B: descriptivos
    return this.prisma.novedad.update({
      where: { id_novedad: id },
      data: {
        ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio) }),
        ...(dto.fecha_fin    && { fecha_fin:    new Date(dto.fecha_fin) }),
        ...(dto.tipo        && { tipo:        dto.tipo }),
        ...(dto.descripcion && { descripcion: dto.descripcion }),
        ...(dto.soporte_url !== undefined && { soporte_url: dto.soporte_url }),
      },
    });
  }

  // ─── REMOVE (soft delete) ──────────────────────────────────
async remove(id: number, caller: Caller) {
  // ✅ RN-NOV-001
  if (caller.rol === Rol.ADM && !caller.acceso_global) {
    throw new ForbiddenException(
      'Solo el administrador global puede eliminar novedades.',
    );
  }
    await this.validarScopeNovedad(id, caller);

    const novedad = await this.findOne(id); // sin caller — scope ya validado

    if (novedad.estado === 'Eliminada') {
      throw new ConflictException('La novedad ya fue eliminada.');
    }

    return this.prisma.novedad.update({
      where: { id_novedad: id },
      data:  { estado: 'Eliminada' },
    });
  }

  // ─── FIND BY DEPARTMENT (ADM) ──────────────────────────────
  async findByDepartment(id_departamento: number | null) {
    if (!id_departamento) {
      throw new BadRequestException(
        'No tienes un departamento asignado. Contacta al SA para que te asigne uno.',
      );
    }

    return this.prisma.novedad.findMany({
      where: {
        estado:   { in: ['Registrada', 'Activa'] },
        afectado: { id_departamento },
      },
      orderBy: { fecha_inicio: 'asc' },
      include: {
        afectado: { select: { id_usuario: true, nombre: true, email: true } },
      },
    });
  }
}