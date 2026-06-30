import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum MallaAccion {
  Submit   = 'submit',
  Adjust   = 'adjust',
  Resubmit = 'resubmit',
  Reject   = 'reject',
  Publish  = 'publish',
}

export class TransitionScheduleDto {
  @ApiProperty({
    enum: MallaAccion,
    example: MallaAccion.Submit,
    description:
      'submit: Borrador→Propuesta | adjust: Propuesta→Ajustando | ' +
      'resubmit: Ajustando→Propuesta | reject: Propuesta→Rechazada | ' +
      'publish: Propuesta→Publicada',
  })
  @IsEnum(MallaAccion)
  accion: MallaAccion;
}