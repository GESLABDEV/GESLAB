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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const ROL_SUPERVISOR_REQUERIDO = {
    [client_1.Rol.AGE]: client_1.Rol.MOD,
    [client_1.Rol.MOD]: client_1.Rol.ADM,
    [client_1.Rol.ADM]: client_1.Rol.SA,
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarScopeDepto(id_usuario_objetivo, caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.acceso_global)
            return;
        if (!caller.id_departamento) {
            throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
        }
        const objetivo = await this.prisma.usuario.findUnique({
            where: { id_usuario: id_usuario_objetivo },
            select: { id_departamento: true },
        });
        if (!objetivo) {
            throw new common_1.NotFoundException(`Usuario con ID ${id_usuario_objetivo} no encontrado.`);
        }
        if (objetivo.id_departamento !== caller.id_departamento) {
            throw new common_1.ForbiddenException('No puedes gestionar usuarios fuera de tu departamento.');
        }
    }
    async create(dto, caller) {
        const exists = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        });
        if (exists) {
            throw new common_1.ConflictException(`El email ${dto.email} ya está registrado.`);
        }
        let id_departamento = dto.id_departamento ?? null;
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            if (!caller.id_departamento) {
                throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
            }
            id_departamento = caller.id_departamento;
        }
        const hashedPassword = await bcrypt.hash(dto.contrasena, 10);
        const user = await this.prisma.usuario.create({
            data: {
                nombre: dto.nombre,
                email: dto.email,
                contrasena_hash: hashedPassword,
                rol: dto.rol,
                id_departamento,
                ...(dto.id_moderador !== undefined && { id_moderador: dto.id_moderador }),
            },
        });
        return this.sanitize(user);
    }
    async findAll(caller, page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const scopeWhere = {};
        if (caller.rol === client_1.Rol.ADM && !caller.acceso_global) {
            if (!caller.id_departamento) {
                throw new common_1.BadRequestException('No tienes un departamento asignado. Contacta al SA.');
            }
            scopeWhere.id_departamento = caller.id_departamento;
        }
        const where = search
            ? {
                ...scopeWhere,
                OR: [
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
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
                    id_usuario: true,
                    nombre: true,
                    email: true,
                    rol: true,
                    activo: true,
                    id_departamento: true,
                    id_moderador: true,
                    creado_en: true,
                },
            }),
            this.prisma.usuario.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id, caller) {
        if (caller) {
            await this.validarScopeDepto(id, caller);
        }
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario: id },
            select: {
                id_usuario: true,
                nombre: true,
                email: true,
                rol: true,
                activo: true,
                id_departamento: true,
                id_moderador: true,
                creado_en: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return user;
    }
    async update(id, dto, caller) {
        await this.validarScopeDepto(id, caller);
        const usuarioActual = await this.findOne(id);
        const rolEfectivo = dto.rol ?? usuarioActual.rol;
        if (dto.id_moderador !== undefined && dto.id_moderador !== null) {
            if (rolEfectivo === client_1.Rol.SA) {
                throw new common_1.BadRequestException('Un usuario con rol SA no puede tener supervisor.');
            }
            const rolSupervisorRequerido = ROL_SUPERVISOR_REQUERIDO[rolEfectivo];
            const supervisor = await this.prisma.usuario.findUnique({
                where: { id_usuario: dto.id_moderador },
                select: { id_usuario: true, nombre: true, rol: true, activo: true },
            });
            if (!supervisor) {
                throw new common_1.BadRequestException(`El usuario id=${dto.id_moderador} no existe.`);
            }
            if (supervisor.rol !== rolSupervisorRequerido) {
                throw new common_1.BadRequestException(`El supervisor de un ${rolEfectivo} debe tener rol ${rolSupervisorRequerido}. ` +
                    `El usuario seleccionado tiene rol ${supervisor.rol}.`);
            }
        }
        const updated = await this.prisma.usuario.update({
            where: { id_usuario: id },
            data: {
                ...(dto.nombre && { nombre: dto.nombre }),
                ...(dto.email && { email: dto.email }),
                ...(dto.rol && { rol: dto.rol }),
                ...(dto.id_departamento && { id_departamento: dto.id_departamento }),
                ...(dto.id_moderador !== undefined && { id_moderador: dto.id_moderador }),
            },
        });
        return this.sanitize(updated);
    }
    async deactivate(id, caller) {
        await this.validarScopeDepto(id, caller);
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
    async activate(id, caller) {
        await this.validarScopeDepto(id, caller);
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario: id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        if (user.activo) {
            throw new common_1.ConflictException(`El usuario ${user.nombre} ya se encuentra activo.`);
        }
        const updated = await this.prisma.usuario.update({
            where: { id_usuario: id },
            data: { activo: true },
        });
        return {
            message: `Usuario ${updated.nombre} reactivado correctamente.`,
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