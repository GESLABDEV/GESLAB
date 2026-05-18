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
let NoveltiesService = class NoveltiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, registradoPorId) {
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
                estado: { in: ['Registrada', 'Activa'] },
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
                id_registrado_por: registradoPorId,
            },
        });
    }
    async findAll(page = 1, limit = 20, tipo, id_usuario) {
        const skip = (page - 1) * limit;
        const where = { NOT: { estado: 'Eliminada' } };
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
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findTeam(moderadorId) {
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
    async findOne(id) {
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
    async update(id, dto) {
        const novedad = await this.findOne(id);
        if (new Date(novedad.fecha_inicio) <= new Date()) {
            throw new common_1.UnprocessableEntityException('No se puede editar una novedad cuya fecha de inicio ya ocurrió.');
        }
        return this.prisma.novedad.update({
            where: { id_novedad: id },
            data: {
                ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio) }),
                ...(dto.fecha_fin && { fecha_fin: new Date(dto.fecha_fin) }),
                ...(dto.descripcion && { descripcion: dto.descripcion }),
                ...(dto.soporte_url !== undefined && { soporte_url: dto.soporte_url }),
            },
        });
    }
    async remove(id) {
        const novedad = await this.findOne(id);
        if (novedad.estado === 'Eliminada') {
            throw new common_1.ConflictException('La novedad ya fue eliminada.');
        }
        return this.prisma.novedad.update({
            where: { id_novedad: id },
            data: { estado: 'Eliminada' },
        });
    }
};
exports.NoveltiesService = NoveltiesService;
exports.NoveltiesService = NoveltiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NoveltiesService);
//# sourceMappingURL=novelties.service.js.map