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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paginated_response_interface_1 = require("../common/interfaces/paginated-response.interface");
const client_1 = require("@prisma/client");
const ADMIN_SELECT = {
    id_usuario: true,
    nombre: true,
    email: true,
    rol: true,
};
let DepartmentsService = class DepartmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarAdministrador(id_administrador, excludeDeptoId) {
        const admin = await this.prisma.usuario.findUnique({
            where: { id_usuario: id_administrador },
            select: { id_usuario: true, nombre: true, rol: true, activo: true },
        });
        if (!admin) {
            throw new common_1.NotFoundException(`Usuario con ID ${id_administrador} no encontrado.`);
        }
        if (admin.rol !== client_1.Rol.ADM) {
            throw new common_1.BadRequestException(`El administrador del departamento debe tener rol ADM. ` +
                `El usuario seleccionado tiene rol ${admin.rol}.`);
        }
        if (!admin.activo) {
            throw new common_1.BadRequestException(`El usuario ${admin.nombre} está inactivo y no puede ser asignado como administrador.`);
        }
        const deptoExistente = await this.prisma.departamento.findFirst({
            where: {
                id_administrador,
                ...(excludeDeptoId && {
                    NOT: { id_departamento: excludeDeptoId },
                }),
            },
            select: { id_departamento: true, nombre: true },
        });
        if (deptoExistente) {
            throw new common_1.ConflictException(`${admin.nombre} ya administra el departamento "${deptoExistente.nombre}". ` +
                `Un ADM solo puede administrar un departamento.`);
        }
    }
    async findAll(dto) {
        const { page = 1, limit = 20, search } = dto;
        const skip = (page - 1) * limit;
        const where = search
            ? { nombre: { contains: search, mode: 'insensitive' } }
            : {};
        const [data, total] = await this.prisma.$transaction([
            this.prisma.departamento.findMany({
                where,
                include: {
                    administrador: { select: ADMIN_SELECT },
                    usuarios: {
                        where: { activo: true },
                        select: { id_usuario: true, nombre: true, email: true, rol: true },
                    },
                },
                skip,
                take: limit,
            }),
            this.prisma.departamento.count({ where }),
        ]);
        return (0, paginated_response_interface_1.buildPaginatedResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const dept = await this.prisma.departamento.findUnique({
            where: { id_departamento: id },
            include: {
                administrador: { select: ADMIN_SELECT },
                usuarios: {
                    where: { activo: true },
                    select: { id_usuario: true, nombre: true, email: true, rol: true },
                },
            },
        });
        if (!dept)
            throw new common_1.NotFoundException(`Departamento ${id} no encontrado`);
        return dept;
    }
    async create(dto) {
        if (dto.id_administrador) {
            await this.validarAdministrador(dto.id_administrador);
        }
        return this.prisma.departamento.create({
            data: {
                nombre: dto.nombre,
                ...(dto.id_administrador && { id_administrador: dto.id_administrador }),
            },
            include: {
                administrador: { select: ADMIN_SELECT },
            },
        });
    }
    async update(id, dto) {
        const before = await this.findOne(id);
        if (dto.id_administrador !== undefined && dto.id_administrador !== null) {
            await this.validarAdministrador(dto.id_administrador, id);
        }
        const after = await this.prisma.departamento.update({
            where: { id_departamento: id },
            data: {
                ...(dto.nombre && { nombre: dto.nombre }),
                ...(dto.id_administrador !== undefined && { id_administrador: dto.id_administrador }),
            },
            include: {
                administrador: { select: ADMIN_SELECT },
            },
        });
        return { before, after };
    }
    async remove(id) {
        await this.findOne(id);
        const activeUsers = await this.prisma.usuario.count({
            where: { id_departamento: id, activo: true },
        });
        if (activeUsers > 0) {
            throw new common_1.ConflictException(`No se puede eliminar: el departamento tiene ${activeUsers} usuario(s) activo(s)`);
        }
        return this.prisma.departamento.delete({ where: { id_departamento: id } });
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map