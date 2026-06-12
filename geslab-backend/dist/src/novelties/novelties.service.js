"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoveltiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let NoveltiesService = class NoveltiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarScopeUsuario(id_usuario, caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.acceso_global)
            return;
        if (!caller.id_departamento) {
            throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
        }
        const usuario = await this.prisma.usuario.findUnique({
            where: { id_usuario },
            select: { id_departamento: true },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario ${id_usuario} no encontrado.`);
        }
        if (usuario.id_departamento !== caller.id_departamento) {
            throw new common_1.ForbiddenException('No puedes registrar novedades a usuarios fuera de tu departamento.');
        }
    }
    async validarScopeNovedad(id_novedad, caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.rol === client_1.Rol.MOD)
            return;
        if (caller.acceso_global)
            return;
        if (!caller.id_departamento) {
            throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
        }
        const novedad = await this.prisma.novedad.findUnique({
            where: { id_novedad },
            select: { afectado: { select: { id_departamento: true } } },
        });
        if (!novedad) {
            throw new common_1.NotFoundException(`Novedad ${id_novedad} no encontrada.`);
        }
        if (novedad.afectado.id_departamento !== caller.id_departamento) {
            throw new common_1.ForbiddenException('No puedes gestionar novedades fuera de tu departamento.');
        }
    }
    async create(dto, caller) {
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            throw new common_1.ForbiddenException('Solo el administrador global puede registrar novedades.');
        }
        await this.validarScopeUsuario(dto.id_usuario, caller);
        const usuario = await this.prisma.usuario.findUnique({
            where: { id_usuario: dto.id_usuario },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario ${dto.id_usuario} no encontrado.`);
        }
        if (!usuario.activo) {
            throw new common_1.ConflictException('No se puede registrar novedad a un usuario inactivo.');
        }
        const overlap = await this.prisma.novedad.findFirst({
            where: {
                id_usuario: dto.id_usuario,
                estado: { in: [client_1.EstadoNovedad.Registrada, client_1.EstadoNovedad.Activa] },
                AND: [
                    { fecha_inicio: { lte: new Date(dto.fecha_fin) } },
                    { fecha_fin: { gte: new Date(dto.fecha_inicio) } },
                ],
            },
        });
        if (overlap) {
            throw new common_1.ConflictException('El colaborador ya tiene una novedad activa en ese período.');
        }
        return this.prisma.novedad.create({
            data: {
                tipo: dto.tipo,
                fecha_inicio: new Date(dto.fecha_inicio),
                fecha_fin: new Date(dto.fecha_fin),
                descripcion: dto.descripcion,
                soporte_url: dto.soporte_url,
                id_usuario: dto.id_usuario,
                id_registrado_por: caller.id_usuario,
            },
        });
    }
    async findAll(caller, page = 1, limit = 20, tipo, id_usuario) {
        const skip = (page - 1) * limit;
        const scopeAfectado = {};
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            if (!caller.id_departamento) {
                throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
            }
            scopeAfectado.afectado = { id_departamento: caller.id_departamento };
        }
        const where = {
            NOT: { estado: client_1.EstadoNovedad.Eliminada },
            ...scopeAfectado,
        };
        if (tipo)
            where.tipo = tipo;
        if (id_usuario)
            where.id_usuario = id_usuario;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.novedad.findMany({
                where,
                skip,
                take: limit,
                orderBy: { creado_en: 'desc' },
                include: {
                    afectado: { select: { id_usuario: true, nombre: true, email: true } },
                    registrado_por: { select: { id_usuario: true, nombre: true } },
                },
            }),
            this.prisma.novedad.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findTeam(moderadorId) {
        return this.prisma.novedad.findMany({
            where: {
                estado: { in: [client_1.EstadoNovedad.Registrada, client_1.EstadoNovedad.Activa] },
                afectado: { id_moderador: moderadorId },
            },
            orderBy: { fecha_inicio: 'asc' },
            include: {
                afectado: { select: { id_usuario: true, nombre: true, email: true } },
            },
        });
    }
    async findOne(id, caller) {
        if (caller) {
            await this.validarScopeNovedad(id, caller);
        }
        const novedad = await this.prisma.novedad.findUnique({
            where: { id_novedad: id },
            include: {
                afectado: { select: { id_usuario: true, nombre: true, email: true } },
                registrado_por: { select: { id_usuario: true, nombre: true } },
            },
        });
        if (!novedad) {
            throw new common_1.NotFoundException(`Novedad ${id} no encontrada.`);
        }
        return novedad;
    }
    async update(id, dto, caller) {
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            throw new common_1.ForbiddenException('Solo el administrador global puede modificar novedades.');
        }
        await this.validarScopeNovedad(id, caller);
        const novedad = await this.findOne(id);
        const quiereCambiarFechas = dto.fecha_inicio || dto.fecha_fin;
        const fechaInicioPasada = new Date(novedad.fecha_inicio) <= new Date();
        if (quiereCambiarFechas && fechaInicioPasada) {
            throw new common_1.UnprocessableEntityException('No se pueden modificar las fechas de una novedad cuya fecha de inicio ya ocurrió.');
        }
        return this.prisma.novedad.update({
            where: { id_novedad: id },
            data: {
                ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio) }),
                ...(dto.fecha_fin && { fecha_fin: new Date(dto.fecha_fin) }),
                ...(dto.tipo && { tipo: dto.tipo }),
                ...(dto.descripcion && { descripcion: dto.descripcion }),
                ...(dto.soporte_url !== undefined && { soporte_url: dto.soporte_url }),
            },
        });
    }
    async remove(id, caller) {
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            throw new common_1.ForbiddenException('Solo el administrador global puede eliminar novedades.');
        }
        await this.validarScopeNovedad(id, caller);
        const novedad = await this.findOne(id);
        if (novedad.estado === client_1.EstadoNovedad.Eliminada) {
            throw new common_1.ConflictException('La novedad ya fue eliminada.');
        }
        return this.prisma.novedad.update({
            where: { id_novedad: id },
            data: { estado: client_1.EstadoNovedad.Eliminada },
        });
    }
    async findByDepartment(id_departamento) {
        if (!id_departamento) {
            throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA para que te asigne uno.');
        }
        return this.prisma.novedad.findMany({
            where: {
                estado: { in: [client_1.EstadoNovedad.Registrada, client_1.EstadoNovedad.Activa] },
                afectado: { id_departamento },
            },
            orderBy: { fecha_inicio: 'asc' },
            include: {
                afectado: { select: { id_usuario: true, nombre: true, email: true } },
            },
        });
    }
};
exports.NoveltiesService = NoveltiesService;
exports.NoveltiesService = NoveltiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NoveltiesService);
//# sourceMappingURL=novelties.service.js.map