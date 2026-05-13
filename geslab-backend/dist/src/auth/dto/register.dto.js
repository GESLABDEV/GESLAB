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
exports.RegisterDto = exports.RolUsuario = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var RolUsuario;
(function (RolUsuario) {
    RolUsuario["SA"] = "SA";
    RolUsuario["ADM"] = "ADM";
    RolUsuario["MOD"] = "MOD";
    RolUsuario["AGE"] = "AGE";
})(RolUsuario || (exports.RolUsuario = RolUsuario = {}));
class RegisterDto {
    nombre;
    email;
    password;
    rol;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Daniel Restrepo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'daniel@geslab.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El email no tiene un formato válido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MiPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RolUsuario, example: RolUsuario.AGE }),
    (0, class_validator_1.IsEnum)(RolUsuario),
    __metadata("design:type", String)
], RegisterDto.prototype, "rol", void 0);
//# sourceMappingURL=register.dto.js.map