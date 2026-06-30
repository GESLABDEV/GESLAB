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
exports.CreateScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateScheduleDto {
    periodo_inicio;
    periodo_fin;
    frecuencia;
    id_departamento;
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-07-01', description: 'Fecha de inicio del período (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "periodo_inicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-07-31', description: 'Fecha de fin del período (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "periodo_fin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.FrecuenciaMalla, example: client_1.FrecuenciaMalla.Semanal }),
    (0, class_validator_1.IsEnum)(client_1.FrecuenciaMalla),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "frecuencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del departamento al que pertenece la malla' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "id_departamento", void 0);
//# sourceMappingURL=create-schedule.dto.js.map