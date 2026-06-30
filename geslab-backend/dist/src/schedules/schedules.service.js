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
var SchedulesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const transition_schedule_dto_1 = require("./dto/transition-schedule.dto");
const USUARIO_SELECT = {
    id_usuario: true,
    nombre: true,
    email: true,
    rol: true,
};
const DEPARTAMENTO_SELECT = {
    id_departamento: true,
    nombre: true,
};
let SchedulesService = class SchedulesService {
    static { SchedulesService_1 = this; }
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    assertPuedeEscribir(caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.rol === client_1.Rol.ADM && caller.acceso_global)
            return;
        throw new common_1.ForbiddenException('Solo un Administrador Global puede crear, editar o eliminar mallas.');
    }
    buildWhereClause(caller) {
        if (caller.rol === client_1.Rol.SA || caller.acceso_global)
            return {};
        if (caller.rol === client_1.Rol.ADM) {
            return { id_departamento: caller.id_departamento };
        }
        throw new common_1.ForbiddenException('No tiene acceso al módulo de mallas.');
    }
    assertPeriodoValido(inicio, fin) {
        if (fin <= inicio) {
            throw new common_1.BadRequestException('periodo_fin debe ser posterior a periodo_inicio.');
        }
    }
    static TRANSICIONES = {
        [transition_schedule_dto_1.MallaAccion.Submit]: { desde: [client_1.EstadoMalla.Borrador], hacia: client_1.EstadoMalla.Propuesta },
        [transition_schedule_dto_1.MallaAccion.Adjust]: { desde: [client_1.EstadoMalla.Propuesta], hacia: client_1.EstadoMalla.Ajustando },
        [transition_schedule_dto_1.MallaAccion.Resubmit]: { desde: [client_1.EstadoMalla.Ajustando], hacia: client_1.EstadoMalla.Propuesta },
        [transition_schedule_dto_1.MallaAccion.Reject]: { desde: [client_1.EstadoMalla.Propuesta], hacia: client_1.EstadoMalla.Rechazada },
        [transition_schedule_dto_1.MallaAccion.Publish]: { desde: [client_1.EstadoMalla.Propuesta], hacia: client_1.EstadoMalla.Publicada },
    };
    async findAll(caller) {
        const where = this.buildWhereClause(caller);
        return this.prisma.malla.findMany({
            where,
            include: {
                departamento: { select: DEPARTAMENTO_SELECT },
                creador: { select: USUARIO_SELECT },
                aprobador: { select: USUARIO_SELECT },
                _count: { select: { turnos: true } },
            },
            orderBy: [{ estado: 'asc' }, { periodo_inicio: 'desc' }],
        });
    }
    async findOne(id, caller) {
        const where = { id_malla: id, ...this.buildWhereClause(caller) };
        const malla = await this.prisma.malla.findFirst({
            where,
            include: {
                departamento: { select: DEPARTAMENTO_SELECT },
                creador: { select: USUARIO_SELECT },
                aprobador: { select: USUARIO_SELECT },
                turnos: true,
            },
        });
        if (!malla) {
            throw new common_1.NotFoundException(`Malla con ID ${id} no encontrada.`);
        }
        return malla;
    }
    async create(dto, caller) {
        this.assertPuedeEscribir(caller);
        const inicio = new Date(dto.periodo_inicio);
        const fin = new Date(dto.periodo_fin);
        this.assertPeriodoValido(inicio, fin);
        const dept = await this.prisma.departamento.findUnique({
            where: { id_departamento: dto.id_departamento },
        });
        if (!dept) {
            throw new common_1.BadRequestException(`Departamento con ID ${dto.id_departamento} no encontrado.`);
        }
        return this.prisma.malla.create({
            data: {
                periodo_inicio: inicio,
                periodo_fin: fin,
                frecuencia: dto.frecuencia,
                estado: client_1.EstadoMalla.Borrador,
                id_departamento: dto.id_departamento,
                id_creador: caller.id_usuario,
            },
            include: {
                departamento: { select: DEPARTAMENTO_SELECT },
                creador: { select: USUARIO_SELECT },
            },
        });
    }
    async update(id, dto, caller) {
        this.assertPuedeEscribir(caller);
        const before = await this.findOne(id, caller);
        const estadosEditables = [client_1.EstadoMalla.Borrador, client_1.EstadoMalla.Ajustando];
        if (!estadosEditables.includes(before.estado)) {
            throw new common_1.BadRequestException(`No se puede editar una malla en estado "${before.estado}". ` +
                `Solo es editable en estado Borrador o Ajustando.`);
        }
        const inicio = dto.periodo_inicio ? new Date(dto.periodo_inicio) : before.periodo_inicio;
        const fin = dto.periodo_fin ? new Date(dto.periodo_fin) : before.periodo_fin;
        this.assertPeriodoValido(inicio, fin);
        if (dto.id_departamento !== undefined) {
            const dept = await this.prisma.departamento.findUnique({
                where: { id_departamento: dto.id_departamento },
            });
            if (!dept) {
                throw new common_1.BadRequestException(`Departamento con ID ${dto.id_departamento} no encontrado.`);
            }
        }
        const after = await this.prisma.malla.update({
            where: { id_malla: id },
            data: {
                ...(dto.periodo_inicio !== undefined && { periodo_inicio: new Date(dto.periodo_inicio) }),
                ...(dto.periodo_fin !== undefined && { periodo_fin: new Date(dto.periodo_fin) }),
                ...(dto.frecuencia !== undefined && { frecuencia: dto.frecuencia }),
                ...(dto.id_departamento !== undefined && { id_departamento: dto.id_departamento }),
            },
            include: {
                departamento: { select: DEPARTAMENTO_SELECT },
                creador: { select: USUARIO_SELECT },
                aprobador: { select: USUARIO_SELECT },
            },
        });
        return { before, after };
    }
    async remove(id, caller) {
        this.assertPuedeEscribir(caller);
        const malla = await this.findOne(id, caller);
        if (malla.estado !== client_1.EstadoMalla.Borrador) {
            throw new common_1.BadRequestException(`Solo se pueden eliminar mallas en estado Borrador. ` +
                `Estado actual: "${malla.estado}".`);
        }
        return this.prisma.malla.delete({ where: { id_malla: id } });
    }
    async transition(id, dto, caller) {
        this.assertPuedeEscribir(caller);
        const malla = await this.findOne(id, caller);
        const regla = SchedulesService_1.TRANSICIONES[dto.accion];
        if (!regla.desde.includes(malla.estado)) {
            throw new common_1.BadRequestException(`La acción "${dto.accion}" no es válida desde el estado "${malla.estado}". ` +
                `Estado(s) válido(s) para esta acción: ${regla.desde.join(', ')}.`);
        }
        if (dto.accion === transition_schedule_dto_1.MallaAccion.Publish) {
            const conflictos = await this.prisma.turno.count({
                where: { id_malla: id, cst_conflicto: true },
            });
            if (conflictos > 0) {
                throw new common_1.BadRequestException(`No se puede publicar la malla: ${conflictos} turno(s) tienen conflictos CST. ` +
                    `Resuelva los conflictos antes de publicar.`);
            }
        }
        return this.prisma.malla.update({
            where: { id_malla: id },
            data: {
                estado: regla.hacia,
                ...(dto.accion === transition_schedule_dto_1.MallaAccion.Publish && {
                    fecha_publicacion: new Date(),
                    id_aprobador: caller.id_usuario,
                }),
            },
            include: {
                departamento: { select: DEPARTAMENTO_SELECT },
                creador: { select: USUARIO_SELECT },
                aprobador: { select: USUARIO_SELECT },
            },
        });
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = SchedulesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map