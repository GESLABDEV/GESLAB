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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const create_shift_template_dto_1 = require("./dto/create-shift-template.dto");
const update_shift_template_dto_1 = require("./dto/update-shift-template.dto");
const shift_templates_service_1 = require("./shift-templates.service");
let ShiftTemplatesController = class ShiftTemplatesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
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
};
exports.ShiftTemplatesController = ShiftTemplatesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las plantillas de turno' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de plantillas' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acceso denegado' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una plantilla por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plantilla encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plantilla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShiftTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva plantilla de turno' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plantilla creada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o hora_fin <= hora_inicio' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede crear plantillas' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shift_template_dto_1.CreateShiftTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], ShiftTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una plantilla de turno (respuesta con before/after)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plantilla actualizada — incluye before y after' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o hora_fin <= hora_inicio' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede editar plantillas' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plantilla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_shift_template_dto_1.UpdateShiftTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], ShiftTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una plantilla de turno' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plantilla eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede eliminar plantillas' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plantilla no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ShiftTemplatesController.prototype, "remove", null);
exports.ShiftTemplatesController = ShiftTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('Shift Templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('shift-templates'),
    __metadata("design:paramtypes", [shift_templates_service_1.ShiftTemplatesService])
], ShiftTemplatesController);
//# sourceMappingURL=shift-templates.controller.js.map