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
exports.DecideRequestDto = exports.DecisionEstado = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var DecisionEstado;
(function (DecisionEstado) {
    DecisionEstado["Aprobada"] = "Aprobada";
    DecisionEstado["Rechazada"] = "Rechazada";
})(DecisionEstado || (exports.DecisionEstado = DecisionEstado = {}));
class DecideRequestDto {
    estado;
    comentario;
}
exports.DecideRequestDto = DecideRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: DecisionEstado,
        example: 'Aprobada',
    }),
    (0, class_validator_1.IsEnum)(DecisionEstado),
    __metadata("design:type", String)
], DecideRequestDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se aprueba, debe regresar el 20/06 en el horario de 8:00 a 6:00.',
        minLength: 10,
        maxLength: 1000,
        description: 'Obligatorio para cualquier decisión. ' +
            'Debe empezar con letra. ' +
            'Permite letras, números, espacios y puntuación básica (. , ; : / - ()). ' +
            'Mínimo 10 caracteres.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El comentario es obligatorio.' }),
    (0, class_validator_1.MinLength)(10, { message: 'El comentario debe tener al menos 10 caracteres.' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'El comentario no puede superar los 1000 caracteres.' }),
    (0, class_validator_1.Matches)(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,;:/\-()\u00C0-\u024F#$%]*$/, {
        message: 'El comentario debe comenzar con una letra y puede contener letras, números, espacios y puntuación básica (. , ; : / - ).',
    }),
    __metadata("design:type", String)
], DecideRequestDto.prototype, "comentario", void 0);
//# sourceMappingURL=decide-request.dto.js.map