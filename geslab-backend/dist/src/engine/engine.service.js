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
exports.EngineService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function buildFechas(inicio, fin) {
    const fechas = [];
    const current = new Date(inicio);
    while (current <= fin) {
        fechas.push(new Date(current));
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return fechas;
}
let EngineService = class EngineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    assertPuedeEscribir(caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.rol === client_1.Rol.ADM && caller.acceso_global)
            return;
        throw new common_1.ForbiddenException('Solo un Administrador Global puede generar turnos.');
    }
    async generate(dto, caller) {
        this.assertPuedeEscribir(caller);
        const malla = await this.prisma.malla.findUnique({
            where: { id_malla: dto.id_malla },
            include: { departamento: { select: { id_departamento: true, nombre: true } } },
        });
        if (!malla) {
            throw new common_1.NotFoundException(`Malla con ID ${dto.id_malla} no encontrada.`);
        }
        if (malla.estado !== client_1.EstadoMalla.Borrador) {
            throw new common_1.BadRequestException(`La malla debe estar en estado Borrador para generar turnos. ` +
                `Estado actual: "${malla.estado}".`);
        }
        const plantilla = await this.prisma.plantillaTurno.findUnique({
            where: { id_plantilla: dto.id_plantilla },
        });
        if (!plantilla) {
            throw new common_1.NotFoundException(`Plantilla con ID ${dto.id_plantilla} no encontrada.`);
        }
        if (!plantilla.activa) {
            throw new common_1.BadRequestException(`La plantilla "${plantilla.nombre}" está inactiva y no puede usarse para generar turnos.`);
        }
        const usuarios = await this.prisma.usuario.findMany({
            where: { id_usuario: { in: dto.id_usuarios } },
            select: { id_usuario: true, nombre: true, id_departamento: true },
        });
        if (usuarios.length !== dto.id_usuarios.length) {
            const encontrados = new Set(usuarios.map((u) => u.id_usuario));
            const noEncontrados = dto.id_usuarios.filter((id) => !encontrados.has(id));
            throw new common_1.BadRequestException(`Los siguientes ID de usuario no existen: [${noEncontrados.join(', ')}].`);
        }
        const fueraDept = usuarios.filter((u) => u.id_departamento !== malla.id_departamento);
        if (fueraDept.length > 0) {
            const detalle = fueraDept
                .map((u) => `${u.id_usuario} (${u.nombre})`)
                .join(', ');
            throw new common_1.BadRequestException(`Los siguientes usuarios no pertenecen al departamento "${malla.departamento.nombre}": [${detalle}].`);
        }
        const fechas = buildFechas(malla.periodo_inicio, malla.periodo_fin);
        const total_dias = fechas.length;
        const total_usuarios = dto.id_usuarios.length;
        const existentes = await this.prisma.turno.findMany({
            where: {
                id_malla: dto.id_malla,
                id_usuario: { in: dto.id_usuarios },
            },
            select: { id_usuario: true, fecha: true },
        });
        const existentesSet = new Set(existentes.map((t) => `${t.id_usuario}-${t.fecha.toISOString().slice(0, 10)}`));
        const turnosNuevos = [];
        for (const fecha of fechas) {
            const fechaKey = fecha.toISOString().slice(0, 10);
            for (const id_usuario of dto.id_usuarios) {
                if (!existentesSet.has(`${id_usuario}-${fechaKey}`)) {
                    turnosNuevos.push({
                        fecha,
                        hora_inicio: plantilla.hora_inicio,
                        hora_fin: plantilla.hora_fin,
                        estado: client_1.EstadoTurno.Pendiente,
                        cst_conflicto: false,
                        cst_detalle: null,
                        id_malla: malla.id_malla,
                        id_usuario,
                        id_departamento: malla.id_departamento,
                    });
                }
            }
        }
        const total_omitidos = total_dias * total_usuarios - turnosNuevos.length;
        if (turnosNuevos.length > 0) {
            await this.prisma.turno.createMany({ data: turnosNuevos });
        }
        return {
            total_dias,
            total_usuarios,
            total_generados: turnosNuevos.length,
            total_omitidos,
            malla: {
                id_malla: malla.id_malla,
                estado: malla.estado,
                periodo_inicio: malla.periodo_inicio,
                periodo_fin: malla.periodo_fin,
                departamento: malla.departamento.nombre,
            },
            plantilla: {
                id_plantilla: plantilla.id_plantilla,
                nombre: plantilla.nombre,
                hora_inicio: plantilla.hora_inicio,
                hora_fin: plantilla.hora_fin,
            },
        };
    }
};
exports.EngineService = EngineService;
exports.EngineService = EngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EngineService);
//# sourceMappingURL=engine.service.js.map