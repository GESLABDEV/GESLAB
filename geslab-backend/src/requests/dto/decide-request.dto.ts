import { IsEnum, IsString, IsOptional, MaxLength, Matches, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Solo los dos estados finales que puede tomar la decisión
export enum DecisionEstado {
  Aprobada  = 'Aprobada',
  Rechazada = 'Rechazada',
}

export class DecideRequestDto {
  @ApiProperty({
    enum: DecisionEstado,
    example: 'Aprobada',
  })
  @IsEnum(DecisionEstado)
  estado!: DecisionEstado;

  @ApiPropertyOptional({
    example: 'MotivoValido',
    maxLength: 1000,
    description: 'Solo se valida cuando el estado es Rechazada.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ValidateIf((o) => o.estado === DecisionEstado.Rechazada)
  @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/, {
    message: 'El comentario de rechazo debe contener solo letras, sin espacios ni caracteres especiales.',
  })
  comentario_rechazo?: string;
}