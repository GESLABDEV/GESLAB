import {
  IsEnum,
  IsDateString,
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoNovedad } from '@prisma/client';

export class CreateNoveltyDto {
  @ApiProperty({ enum: TipoNovedad, example: 'Vacaciones' })
  @IsEnum(TipoNovedad)
  tipo!: TipoNovedad;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  fecha_inicio!: string;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString()
  fecha_fin!: string;

  @ApiProperty({
    example: 'Vacaciones aprobadas período junio 2026',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  descripcion!: string;

  @ApiPropertyOptional({
    example: 'https://storage.geslab.app/docs/soporte.pdf',
  })
  @IsOptional()
  @IsString()
  soporte_url?: string;

  @ApiProperty({
    example: 5,
    description: 'ID del colaborador afectado por la novedad',
  })
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  // id_registrado_por NO va aquí — viene del JWT
}