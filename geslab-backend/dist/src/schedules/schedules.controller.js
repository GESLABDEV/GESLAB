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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const transition_schedule_dto_1 = require("./dto/transition-schedule.dto");
const schedules_service_1 = require("./schedules.service");
let SchedulesController = class SchedulesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(caller) {
        return this.service.findAll(caller);
    }
    findOne(id, caller) {
        return this.service.findOne(id, caller);
    }
    create(dto, caller) {
        return this.service.create(dto, caller);
    }
    update(id, dto, caller) {
        return this.service.update(id, dto, caller);
    }
    remove(id, caller) {
        return this.service.remove(id, caller);
    }
    transition(id, dto, caller) {
        return this.service.transition(id, dto, caller);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mallas (scoping por rol: ADM Depto ve solo su dpto)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de mallas' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acceso denegado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Ver detalle de una malla con sus turnos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Malla encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Malla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva malla (estado inicial: Borrador)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Malla creada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o periodo_fin <= periodo_inicio' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede crear mallas' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Editar malla (solo en Borrador o Ajustando) — respuesta before/after' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Malla actualizada — incluye before y after' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Estado no editable o datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede editar mallas' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Malla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_schedule_dto_1.UpdateScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar malla (solo en estado Borrador)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Malla eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Solo se pueden eliminar mallas en Borrador' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede eliminar mallas' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Malla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/transition'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Ejecutar transición de estado de la malla' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Transición inválida o conflictos CST bloqueando publish' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede ejecutar transiciones' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Malla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_a = typeof transition_schedule_dto_1.TransitionScheduleDto !== "undefined" && transition_schedule_dto_1.TransitionScheduleDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "transition", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, swagger_1.ApiTags)('Schedules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('schedules'),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map