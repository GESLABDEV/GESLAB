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
exports.EngineController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const generate_shifts_dto_1 = require("./dto/generate-shifts.dto");
const engine_service_1 = require("./engine.service");
let EngineController = class EngineController {
    service;
    constructor(service) {
        this.service = service;
    }
    generate(dto, caller) {
        return this.service.generate(dto, caller);
    }
};
exports.EngineController = EngineController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)(client_1.Rol.SA, client_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({
        summary: 'Generar turnos automáticamente para una malla',
        description: 'Dado una malla en Borrador, una plantilla activa y una lista de usuarios del mismo departamento, ' +
            'crea un Turno por cada combinación usuario × día del período. ' +
            'Las combinaciones ya existentes se omiten (idempotente).',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Turnos generados — resumen con totales' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Malla no está en Borrador · Plantilla inactiva · Usuarios fuera del departamento' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Solo ADM Global puede generar turnos' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Malla o plantilla no encontrada' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_shifts_dto_1.GenerateShiftsDto, Object]),
    __metadata("design:returntype", void 0)
], EngineController.prototype, "generate", null);
exports.EngineController = EngineController = __decorate([
    (0, swagger_1.ApiTags)('Engine'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('engine'),
    __metadata("design:paramtypes", [engine_service_1.EngineService])
], EngineController);
//# sourceMappingURL=engine.controller.js.map