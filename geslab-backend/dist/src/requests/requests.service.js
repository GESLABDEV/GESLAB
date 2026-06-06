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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RequestsService = class RequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarScopeSolicitud(id_solicitud, caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.acceso_global)
            return;
        if (!caller.id_departamento) {
            throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
        }
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id_solicitud },
            select: { solicitante: { select: { id_departamento: true } } },
        });
        if (!solicitud) {
            throw new common_1.NotFoundException(`Solicitud ${id_solicitud} no encontrada.`);
        }
        if (solicitud.solicitante.id_departamento !== caller.id_departamento) {
            throw new common_1.ForbiddenException('No puedes gestionar solicitudes fuera de tu departamento.');
        }
    }
    async create(dto, solicitante) {
        const { id_usuario, rol, id_moderador } = solicitante;
        let id_revisor_moderador = null;
        if (rol === client_1.Rol.AGE) {
            if (!id_moderador) {
                throw new common_1.BadRequestException('El agente no tiene un Moderador asignado. Contacta al Administrador.');
            }
            id_revisor_moderador = id_moderador;
        }
        return this.prisma.solicitud.create({
            data: {
                tipo: dto.tipo,
                descripcion: dto.descripcion,
                soporte_url: dto.soporte_url,
                id_solicitante: id_usuario,
                id_revisor_moderador,
                estado: 'Pendiente',
            },
        });
    }
    async findAll(caller, page = 1, limit = 20, tipo, estado, id_usuario) {
        const skip = (page - 1) * limit;
        const scopeWhere = {};
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            if (!caller.id_departamento) {
                throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
            }
            scopeWhere.solicitante = { id_departamento: caller.id_departamento };
        }
        const where = { ...scopeWhere };
        if (tipo)
            where.tipo = tipo;
        if (estado)
            where.estado = estado;
        if (id_usuario)
            where.id_solicitante = id_usuario;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.solicitud.findMany({
                where,
                skip,
                take: limit,
                orderBy: { fecha_solicitud: 'desc' },
                include: {
                    solicitante: { select: { id_usuario: true, nombre: true, rol: true } },
                    revisor_moderador: { select: { id_usuario: true, nombre: true } },
                    aprobador: { select: { id_usuario: true, nombre: true } },
                },
            }),
            this.prisma.solicitud.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findMy(userId, page = 1, limit = 20) {
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
    async findPendingReview(moderadorId) {
        return this.prisma.solicitud.findMany({
            where: {
                id_revisor_moderador: moderadorId,
                estado: 'Pendiente',
            },
            orderBy: { fecha_solicitud: 'asc' },
            include: {
                solicitante: { select: { id_usuario: true, nombre: true, email: true } },
            },
        });
    }
    async findOne(id, caller) {
        console.log('[findOne] caller.rol:', caller.rol, '| tipo:', typeof caller.rol);
        console.log('[findOne] Rol.AGE:', client_1.Rol.AGE, '| iguales:', caller.rol === client_1.Rol.AGE);
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id_solicitud: id },
            include: {
                solicitante: { select: { id_usuario: true, nombre: true, rol: true, id_departamento: true } },
                revisor_moderador: { select: { id_usuario: true, nombre: true } },
                aprobador: { select: { id_usuario: true, nombre: true } },
            },
        });
        if (!solicitud)
            throw new common_1.NotFoundException(`Solicitud ${id} no encontrada.`);
        if (caller.rol === client_1.Rol.AGE && solicitud.id_solicitante !== caller.id_usuario) {
            throw new common_1.ForbiddenException('Solo puedes ver tus propias solicitudes.');
        }
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            if (solicitud.solicitante.id_departamento !== caller.id_departamento) {
                throw new common_1.ForbiddenException('No puedes ver solicitudes fuera de tu departamento.');
            }
        }
        return solicitud;
    }
    async review(id, dto, moderador) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id_solicitud: id },
        });
        if (!solicitud)
            throw new common_1.NotFoundException(`Solicitud ${id} no encontrada.`);
        if (solicitud.estado !== 'Pendiente') {
            throw new common_1.BadRequestException(`La solicitud ya está en estado "${solicitud.estado}". Solo se pueden revisar solicitudes Pendientes.`);
        }
        if (solicitud.id_revisor_moderador !== moderador.id_usuario) {
            throw new common_1.ForbiddenException('Esta solicitud no pertenece a tu equipo.');
        }
        return this.prisma.solicitud.update({
            where: { id_solicitud: id },
            data: {
                estado: 'EnRevision',
                comentario_moderador: dto.comentario_moderador,
            },
        });
    }
    async decide(id, dto, decisor) {
        await this.validarScopeSolicitud(id, decisor);
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id_solicitud: id },
        });
        if (!solicitud)
            throw new common_1.NotFoundException(`Solicitud ${id} no encontrada.`);
        const estadoActual = solicitud.estado;
        if (solicitud.id_revisor_moderador !== null && estadoActual !== 'EnRevision') {
            throw new common_1.BadRequestException('Esta solicitud requiere revisión del Moderador antes de ser decidida (Flujo A).');
        }
        if (solicitud.id_revisor_moderador === null && estadoActual !== 'Pendiente') {
            throw new common_1.BadRequestException(`La solicitud ya fue procesada (estado: "${estadoActual}").`);
        }
        return this.prisma.solicitud.update({
            where: { id_solicitud: id },
            data: {
                estado: dto.estado,
                comentario: dto.comentario,
                id_aprobador: decisor.id_usuario,
            },
        });
    }
    async findPendingMod(caller) {
        const solicitanteWhere = { rol: client_1.Rol.MOD };
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            if (!caller.id_departamento) {
                throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
            }
            solicitanteWhere.id_departamento = caller.id_departamento;
        }
        return this.prisma.solicitud.findMany({
            where: {
                estado: 'Pendiente',
                id_revisor_moderador: null,
                solicitante: solicitanteWhere,
            },
            orderBy: { fecha_solicitud: 'asc' },
            include: {
                solicitante: {
                    select: {
                        id_usuario: true,
                        nombre: true,
                        email: true,
                        id_departamento: true,
                    },
                },
            },
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map