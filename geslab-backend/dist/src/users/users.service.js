"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const exists = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        });
        if (exists) {
            throw new common_1.ConflictException(`El email ${dto.email} ya está registrado.`);
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.usuario.create({
            data: {
                nombre: dto.name,
                email: dto.email,
                contrasena_hash: hashedPassword,
                rol: dto.role,
                id_departamento: dto.departmentId ?? null,
            },
        });
        return this.sanitize(user);
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
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
                    id_usuario: true,
                    nombre: true,
                    email: true,
                    rol: true,
                    activo: true,
                    id_departamento: true,
                    creado_en: true,
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
    async findOne(id) {
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario: id },
            select: {
                id_usuario: true,
                nombre: true,
                email: true,
                rol: true,
                activo: true,
                id_departamento: true,
                creado_en: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updated = await this.prisma.usuario.update({
            where: { id_usuario: id },
            data: {
                ...(dto.name && { nombre: dto.name }),
                ...(dto.email && { email: dto.email }),
                ...(dto.role && { rol: dto.role }),
                ...(dto.departmentId && { id_departamento: dto.departmentId }),
            },
        });
        return this.sanitize(updated);
    }
    async deactivate(id) {
        await this.findOne(id);
        const updated = await this.prisma.usuario.update({
            where: { id_usuario: id },
            data: { activo: false },
        });
        return {
            message: `Usuario ${updated.nombre} desactivado correctamente.`,
            id: updated.id_usuario,
            activo: updated.activo,
        };
    }
    sanitize(user) {
        const { contrasena_hash, ...safe } = user;
        return safe;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map