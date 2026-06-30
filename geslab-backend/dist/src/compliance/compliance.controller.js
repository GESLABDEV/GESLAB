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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const compliance_service_1 = require("./compliance.service");
let ComplianceController = class ComplianceController {
    service;
    constructor(service) {
        this.service = service;
    }
    validate(id_malla, caller) {
        return this.service.validate(id_malla, caller);
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Post)('validate/:id_malla'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({
        summary: 'Validar turnos de una malla contra las reglas CST',
        description: 'Evalúa los turnos generados de la malla indicada contra ConfiguracionST del departamento. ' +
            'Marca cst_conflicto=true en los turnos que violan alguna regla. ' +
            'La operación es idempotente: resetea los flags antes de cada evaluación. ' +
            'No aplica a mallas en estado Publicada.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Validación ejecutada — resumen de conflictos' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Malla publicada o sin turnos' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede ejecutar validación CST' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Malla no encontrada' }),
    __param(0, (0, common_1.Param)('id_malla', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "validate", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('Compliance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('compliance'),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map