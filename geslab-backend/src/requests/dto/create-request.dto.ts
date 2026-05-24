import {
  IsEnum,
  IsString,
  IsOptional,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoSolicitud } from '@prisma/client';

export class CreateRequestDto {
  @ApiProperty({
    enum: TipoSolicitud,
    example: 'CambioDeTurno',
    description: 'Tipo de solicitud según TipoSolicitud del schema',
  })
  @IsEnum(TipoSolicitud)
  tipo!: TipoSolicitud;

  @ApiProperty({
    example: 'Solicito cambio de turno del día 20/06 por compromiso médico.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  descripcion!: string;

  @ApiPropertyOptional({
    example: 'https://storage.geslab.app/soportes/doc.pdf',
  })
  @IsOptional()
  @IsString()
  soporte_url?: string;
}