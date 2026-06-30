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
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function calcHoras(inicio, fin) {
    return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
}
function buildDatetime(fecha, hora) {
    const dt = new Date(fecha);
    dt.setUTCHours(hora.getUTCHours(), hora.getUTCMinutes(), 0, 0);
    return dt;
}
function getISOWeekKey(date) {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
let ComplianceService = class ComplianceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    assertPuedeEscribir(caller) {
        if (caller.rol === client_1.Rol.SA)
            return;
        if (caller.rol === client_1.Rol.ADM && caller.acceso_global)
            return;
        throw new common_1.ForbiddenException('Solo un Administrador Global puede ejecutar la validación CST.');
    }
    async validate(id_malla, caller) {
        this.assertPuedeEscribir(caller);
        const malla = await this.prisma.malla.findUnique({
            where: { id_malla },
            include: { departamento: { select: { id_departamento: true, nombre: true } } },
        });
        if (!malla) {
            throw new common_1.NotFoundException(`Malla con ID ${id_malla} no encontrada.`);
        }
        if (malla.estado === client_1.EstadoMalla.Publicada) {
            throw new common_1.BadRequestException('No se puede re-evaluar una malla ya publicada.');
        }
        const config = await this.prisma.configuracionST.findUnique({
            where: { id_departamento: malla.id_departamento },
        });
        const max_horas_semana = config?.max_horas_semana ?? 48;
        const min_descanso_horas = config?.min_descanso_horas ?? 12;
        const max_dias_seguidos = config?.max_dias_seguidos ?? 6;
        const turnos = await this.prisma.turno.findMany({
            where: { id_malla },
            orderBy: [{ id_usuario: 'asc' }, { fecha: 'asc' }],
        });
        if (turnos.length === 0) {
            return {
                total_turnos: 0,
                total_conflictos: 0,
                total_limpios: 0,
                reglas_aplicadas: { max_horas_semana, min_descanso_horas, max_dias_seguidos },
                conflictos: [],
            };
        }
        await this.prisma.turno.updateMany({
            where: { id_malla },
            data: { cst_conflicto: false, cst_detalle: null },
        });
        const turnosPorUsuario = new Map();
        for (const t of turnos) {
            if (!turnosPorUsuario.has(t.id_usuario)) {
                turnosPorUsuario.set(t.id_usuario, []);
            }
            turnosPorUsuario.get(t.id_usuario).push(t);
        }
        const conflictosMap = new Map();
        const addConflicto = (id_turno, detalle) => {
            if (!conflictosMap.has(id_turno))
                conflictosMap.set(id_turno, []);
            conflictosMap.get(id_turno).push(detalle);
        };
        for (const [, userTurnos] of turnosPorUsuario) {
            const semanas = new Map();
            for (const t of userTurnos) {
                const key = getISOWeekKey(t.fecha);
                if (!semanas.has(key))
                    semanas.set(key, []);
                semanas.get(key).push(t);
            }
            for (const [semanaKey, semanaTurnos] of semanas) {
                let acumulado = 0;
                for (const t of semanaTurnos) {
                    acumulado += calcHoras(t.hora_inicio, t.hora_fin);
                    if (acumulado > max_horas_semana) {
                        addConflicto(t.id_turno, `Semana ${semanaKey}: excede máximo de horas semanales ` +
                            `(${max_horas_semana}h) — acumulado: ${acumulado.toFixed(1)}h.`);
                    }
                }
            }
            for (let i = 1; i < userTurnos.length; i++) {
                const prev = userTurnos[i - 1];
                const curr = userTurnos[i];
                const finPrev = buildDatetime(prev.fecha, prev.hora_fin);
                const iniCurr = buildDatetime(curr.fecha, curr.hora_inicio);
                const descanso = (iniCurr.getTime() - finPrev.getTime()) / (1000 * 60 * 60);
                if (descanso < min_descanso_horas) {
                    addConflicto(curr.id_turno, `Descanso insuficiente entre turnos (mínimo ${min_descanso_horas}h) — ` +
                        `solo ${descanso.toFixed(1)}h entre el turno anterior y este.`);
                }
            }
            let racha = 1;
            for (let i = 1; i < userTurnos.length; i++) {
                const diffDias = (userTurnos[i].fecha.getTime() - userTurnos[i - 1].fecha.getTime()) /
                    (1000 * 60 * 60 * 24);
                if (diffDias === 1) {
                    racha++;
                    if (racha > max_dias_seguidos) {
                        addConflicto(userTurnos[i].id_turno, `Excede máximo de días consecutivos (${max_dias_seguidos}) — ` +
                            `racha actual: ${racha} días.`);
                    }
                }
                else {
                    racha = 1;
                }
            }
        }
        if (conflictosMap.size > 0) {
            await this.prisma.$transaction(Array.from(conflictosMap.entries()).map(([id_turno, detalles]) => this.prisma.turno.update({
                where: { id_turno },
                data: {
                    cst_conflicto: true,
                    cst_detalle: detalles.join(' | '),
                },
            })));
        }
        const turnosMap = new Map(turnos.map((t) => [t.id_turno, t]));
        const conflictosResponse = Array.from(conflictosMap.entries()).map(([id_turno, detalles]) => {
            const t = turnosMap.get(id_turno);
            return {
                id_turno,
                id_usuario: t.id_usuario,
                fecha: t.fecha.toISOString().slice(0, 10),
                cst_detalle: detalles.join(' | '),
            };
        });
        return {
            total_turnos: turnos.length,
            total_conflictos: conflictosMap.size,
            total_limpios: turnos.length - conflictosMap.size,
            reglas_aplicadas: { max_horas_semana, min_descanso_horas, max_dias_seguidos },
            conflictos: conflictosResponse,
        };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map