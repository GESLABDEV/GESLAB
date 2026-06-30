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
exports.GenerateShiftsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GenerateShiftsDto {
    id_malla;
    id_plantilla;
    id_usuarios;
}
exports.GenerateShiftsDto = GenerateShiftsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la malla (debe estar en estado Borrador)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GenerateShiftsDto.prototype, "id_malla", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la plantilla de turno (debe estar activa)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GenerateShiftsDto.prototype, "id_plantilla", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [2, 3, 4],
        description: 'IDs de los usuarios a quienes se asignarán turnos. Deben pertenecer al departamento de la malla.',
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsPositive)({ each: true }),
    __metadata("design:type", Array)
], GenerateShiftsDto.prototype, "id_usuarios", void 0);
//# sourceMappingURL=generate-shifts.dto.js.map