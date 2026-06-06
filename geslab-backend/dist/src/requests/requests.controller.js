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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const requests_service_1 = require("./requests.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const review_request_dto_1 = require("./dto/review-request.dto");
const decide_request_dto_1 = require("./dto/decide-request.dto");
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    create(dto, user) {
        return this.requestsService.create(dto, user);
    }
    findAll(caller, page, limit, tipo, estado, id_usuario) {
        return this.requestsService.findAll(caller, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20, tipo, estado, id_usuario ? parseInt(id_usuario) : undefined);
    }
    findMy(user, page, limit) {
        return this.requestsService.findMy(user.id_usuario, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    findPendingReview(user) {
        return this.requestsService.findPendingReview(user.id_usuario);
    }
    findPendingMod(caller) {
        return this.requestsService.findPendingMod(caller);
    }
    findOne(id, caller) {
        return this.requestsService.findOne(id, caller);
    }
    review(id, dto, user) {
        return this.requestsService.review(id, dto, user);
    }
    decide(id, dto, caller) {
        return this.requestsService.decide(id, dto, caller);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.AGE, role_enum_1.Rol.MOD, role_enum_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({
        summary: '[AGE/MOD/ADM] Crear solicitud laboral — flujo según rol del JWT',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_request_dto_1.CreateRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM, role_enum_1.Rol.SA),
    (0, swagger_1.ApiOperation)({ summary: '[SA/ADM Global] Todas · [ADM Depto] Solo su departamento' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'tipo', required: false, example: 'CambioDeTurno' }),
    (0, swagger_1.ApiQuery)({ name: 'estado', required: false, example: 'Pendiente' }),
    (0, swagger_1.ApiQuery)({ name: 'id_usuario', required: false, example: 5 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('tipo')),
    __param(4, (0, common_1.Query)('estado')),
    __param(5, (0, common_1.Query)('id_usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.AGE, role_enum_1.Rol.MOD, role_enum_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: '[AGE/MOD/ADM] Ver mis propias solicitudes' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findMy", null);
__decorate([
    (0, common_1.Get)('pending-review'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.MOD),
    (0, swagger_1.ApiOperation)({ summary: '[MOD] Ver solicitudes pendientes del equipo' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findPendingReview", null);
__decorate([
    (0, common_1.Get)('pending-mod'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM, role_enum_1.Rol.SA),
    (0, swagger_1.ApiOperation)({
        summary: '[SA/ADM Global] Todas las solicitudes MOD pendientes · [ADM Depto] Solo su departamento',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findPendingMod", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM, role_enum_1.Rol.SA, role_enum_1.Rol.MOD, role_enum_1.Rol.AGE),
    (0, swagger_1.ApiOperation)({ summary: '[SA/ADM Global] Cualquiera · [ADM Depto] Su depto · [AGE] Solo las suyas' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.MOD),
    (0, swagger_1.ApiOperation)({
        summary: '[MOD] Revisar solicitud → EnRevision (Flujo A)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, review_request_dto_1.ReviewRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "review", null);
__decorate([
    (0, common_1.Patch)(':id/decide'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM, role_enum_1.Rol.SA),
    (0, swagger_1.ApiOperation)({ summary: '[SA/ADM Global] Cualquier solicitud · [ADM Depto] Solo su departamento' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, decide_request_dto_1.DecideRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "decide", null);
exports.RequestsController = RequestsController = __decorate([
    (0, swagger_1.ApiTags)('Requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map