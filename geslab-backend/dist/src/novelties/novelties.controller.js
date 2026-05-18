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
exports.NoveltiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const novelties_service_1 = require("./novelties.service");
const create_novelty_dto_1 = require("./dto/create-novelty.dto");
const update_novelty_dto_1 = require("./dto/update-novelty.dto");
let NoveltiesController = class NoveltiesController {
    noveltiesService;
    constructor(noveltiesService) {
        this.noveltiesService = noveltiesService;
    }
    create(dto, user) {
        return this.noveltiesService.create(dto, user.id_usuario);
    }
    findAll(page, limit, tipo, id_usuario) {
        return this.noveltiesService.findAll(page ? parseInt(page) : 1, limit ? parseInt(limit) : 20, tipo, id_usuario ? parseInt(id_usuario) : undefined);
    }
    findTeam(user) {
        return this.noveltiesService.findTeam(user.id_usuario);
    }
    findOne(id) {
        return this.noveltiesService.findOne(id);
    }
    update(id, dto) {
        return this.noveltiesService.update(id, dto);
    }
    remove(id) {
        return this.noveltiesService.remove(id);
    }
};
exports.NoveltiesController = NoveltiesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: '[ADM] Registrar novedad de colaborador' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_novelty_dto_1.CreateNoveltyDto, Object]),
    __metadata("design:returntype", void 0)
], NoveltiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: '[ADM] Listar novedades con filtros opcionales' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'tipo', required: false, example: 'Vacaciones' }),
    (0, swagger_1.ApiQuery)({ name: 'id_usuario', required: false, example: 5 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('tipo')),
    __param(3, (0, common_1.Query)('id_usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], NoveltiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('team'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.MOD),
    (0, swagger_1.ApiOperation)({ summary: '[MOD] Ver novedades activas de supervisados directos' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NoveltiesController.prototype, "findTeam", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM, role_enum_1.Rol.MOD),
    (0, swagger_1.ApiOperation)({ summary: '[ADM, MOD] Ver detalle de novedad' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NoveltiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: '[ADM] Actualizar novedad (solo si fecha_inicio > hoy)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_novelty_dto_1.UpdateNoveltyDto]),
    __metadata("design:returntype", void 0)
], NoveltiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Rol.ADM),
    (0, swagger_1.ApiOperation)({ summary: '[ADM] Eliminar novedad (soft delete → estado Eliminada)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NoveltiesController.prototype, "remove", null);
exports.NoveltiesController = NoveltiesController = __decorate([
    (0, swagger_1.ApiTags)('Novelties'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('novelties'),
    __metadata("design:paramtypes", [novelties_service_1.NoveltiesService])
], NoveltiesController);
//# sourceMappingURL=novelties.controller.js.map