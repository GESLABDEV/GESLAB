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
exports.CreateShiftTemplateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateShiftTemplateDto {
    nombre;
    hora_inicio;
    hora_fin;
    activa;
}
exports.CreateShiftTemplateDto = CreateShiftTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre descriptivo de la plantilla',
        example: 'Turno Mañana',
        minLength: 3,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio.' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede superar 100 caracteres.' }),
    __metadata("design:type", String)
], CreateShiftTemplateDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hora de inicio en formato HH:mm (24h)',
        example: '06:00',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de inicio es obligatoria.' }),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'hora_inicio debe tener formato HH:mm (ej: 06:00, 14:30).',
    }),
    __metadata("design:type", String)
], CreateShiftTemplateDto.prototype, "hora_inicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hora de fin en formato HH:mm (24h). Debe ser mayor que hora_inicio.',
        example: '14:00',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de fin es obligatoria.' }),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'hora_fin debe tener formato HH:mm (ej: 14:00, 22:00).',
    }),
    __metadata("design:type", String)
], CreateShiftTemplateDto.prototype, "hora_fin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indica si la plantilla está activa y disponible para usar',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'activa debe ser un valor booleano.' }),
    __metadata("design:type", Boolean)
], CreateShiftTemplateDto.prototype, "activa", void 0);
//# sourceMappingURL=create-shift-template.dto.js.map