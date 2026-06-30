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
exports.ShiftTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const CREADOR_SELECT = {
    id_usuario: true,
    nombre: true,
    email: true,
    rol: true,
};
function parseHHmm(hhmm) {
    const [hours, minutes] = hhmm.split(':').map(Number);
    const d = new Date(0);
    d.setUTCHours(hours, minutes, 0, 0);
    return d;
}
let ShiftTemplatesService = class ShiftTemplatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    assertPuedeEscribir(caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.rol === client_1.Rol.ADM && caller.acceso_global)
            return;
        throw new common_1.ForbiddenException('Solo un Administrador Global puede crear, editar o eliminar plantillas de turno.');
    }
    assertHoraFinMayorQueInicio(inicio, fin) {
        if (fin <= inicio) {
            throw new common_1.BadRequestException('hora_fin debe ser posterior a hora_inicio. ' +
                'Los turnos que cruzan medianoche no están soportados en esta versión.');
        }
    }
    async findAll() {
        return this.prisma.plantillaTurno.findMany({
            include: { creador: { select: CREADOR_SELECT } },
            orderBy: [{ activa: 'desc' }, { hora_inicio: 'asc' }],
        });
    }
    async findOne(id) {
        const plantilla = await this.prisma.plantillaTurno.findUnique({
            where: { id_plantilla: id },
            include: { creador: { select: CREADOR_SELECT } },
        });
        if (!plantilla) {
            throw new common_1.NotFoundException(`Plantilla de turno con ID ${id} no encontrada.`);
        }
        return plantilla;
    }
    async create(dto, caller) {
        this.assertPuedeEscribir(caller);
        const horaInicio = parseHHmm(dto.hora_inicio);
        const horaFin = parseHHmm(dto.hora_fin);
        this.assertHoraFinMayorQueInicio(horaInicio, horaFin);
        return this.prisma.plantillaTurno.create({
            data: {
                nombre: dto.nombre.trim(),
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                activa: dto.activa ?? true,
                id_creador: caller.id_usuario,
            },
            include: { creador: { select: CREADOR_SELECT } },
        });
    }
    async update(id, dto, caller) {
        this.assertPuedeEscribir(caller);
        const before = await this.findOne(id);
        const horaInicio = dto.hora_inicio
            ? parseHHmm(dto.hora_inicio)
            : before.hora_inicio;
        const horaFin = dto.hora_fin
            ? parseHHmm(dto.hora_fin)
            : before.hora_fin;
        this.assertHoraFinMayorQueInicio(horaInicio, horaFin);
        const after = await this.prisma.plantillaTurno.update({
            where: { id_plantilla: id },
            data: {
                ...(dto.nombre !== undefined && { nombre: dto.nombre.trim() }),
                ...(dto.hora_inicio !== undefined && { hora_inicio: horaInicio }),
                ...(dto.hora_fin !== undefined && { hora_fin: horaFin }),
                ...(dto.activa !== undefined && { activa: dto.activa }),
            },
            include: { creador: { select: CREADOR_SELECT } },
        });
        return { before, after };
    }
    async remove(id, caller) {
        this.assertPuedeEscribir(caller);
        await this.findOne(id);
        return this.prisma.plantillaTurno.delete({ where: { id_plantilla: id } });
    }
};
exports.ShiftTemplatesService = ShiftTemplatesService;
exports.ShiftTemplatesService = ShiftTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShiftTemplatesService);
//# sourceMappingURL=shift-templates.service.js.map