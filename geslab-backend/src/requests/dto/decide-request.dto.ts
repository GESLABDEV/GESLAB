import {
  IsEnum,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: 'Se aprueba, debe regresar el 20/06 en el horario de 8:00 a 6:00.',
    minLength: 10,
    maxLength: 1000,
    description:
      'Obligatorio para cualquier decisión. ' +
      'Debe empezar con letra. ' +
      'Permite letras, números, espacios y puntuación básica (. , ; : / - ()). ' +
      'Mínimo 10 caracteres.',
  })
  @IsString()
  @IsNotEmpty({ message: 'El comentario es obligatorio.' })
  @MinLength(10, { message: 'El comentario debe tener al menos 10 caracteres.' })
  @MaxLength(1000, { message: 'El comentario no puede superar los 1000 caracteres.' })
  @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,;:/\-()\u00C0-\u024F]*$/, {
    message:
      'El comentario debe comenzar con una letra y puede contener letras, números, espacios y puntuación básica (. , ; : / - ).',
  })
  comentario!: string;
}