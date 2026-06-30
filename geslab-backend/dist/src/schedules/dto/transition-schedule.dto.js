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
exports.TransitionScheduleDto = exports.MallaAccion = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var MallaAccion;
(function (MallaAccion) {
    MallaAccion["Submit"] = "submit";
    MallaAccion["Adjust"] = "adjust";
    MallaAccion["Resubmit"] = "resubmit";
    MallaAccion["Reject"] = "reject";
    MallaAccion["Publish"] = "publish";
})(MallaAccion || (exports.MallaAccion = MallaAccion = {}));
class TransitionScheduleDto {
    accion;
}
exports.TransitionScheduleDto = TransitionScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: MallaAccion,
        example: MallaAccion.Submit,
        description: 'submit: Borrador→Propuesta | adjust: Propuesta→Ajustando | ' +
            'resubmit: Ajustando→Propuesta | reject: Propuesta→Rechazada | ' +
            'publish: Propuesta→Publicada',
    }),
    (0, class_validator_1.IsEnum)(MallaAccion),
    __metadata("design:type", String)
], TransitionScheduleDto.prototype, "accion", void 0);
//# sourceMappingURL=transition-schedule.dto.js.map