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
exports.CreateNoveltyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateNoveltyDto {
    tipo;
    fecha_inicio;
    fecha_fin;
    descripcion;
    soporte_url;
    id_usuario;
}
exports.CreateNoveltyDto = CreateNoveltyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TipoNovedad, example: 'Vacaciones' }),
    (0, class_validator_1.IsEnum)(client_1.TipoNovedad),
    __metadata("design:type", String)
], CreateNoveltyDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNoveltyDto.prototype, "fecha_inicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNoveltyDto.prototype, "fecha_fin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Vacaciones aprobadas período junio 2026',
        minLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateNoveltyDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://storage.geslab.app/docs/soporte.pdf',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNoveltyDto.prototype, "soporte_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'ID del colaborador afectado por la novedad',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateNoveltyDto.prototype, "id_usuario", void 0);
//# sourceMappingURL=create-novelty.dto.js.map