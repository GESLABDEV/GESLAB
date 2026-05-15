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
let DepartmentsService = class DepartmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        return this.prisma.departamento.create({ data: { nombre: dto.nombre } });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.departamento.update({
            where: { id_departamento: id },
            data: { nombre: dto.nombre },
        });
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