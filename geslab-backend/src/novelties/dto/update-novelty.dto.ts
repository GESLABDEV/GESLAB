import {
  IsDateString,
  IsEnum,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoNovedad } from '@prisma/client'; 

export class UpdateNoveltyDto {
  @ApiPropertyOptional({ example: '2026-06-02' })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiPropertyOptional({ example: '2026-06-16' })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @ApiPropertyOptional({ minLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(10)
  descripcion?: string;

  // ✅ B5 — tipo siempre editable
  @ApiPropertyOptional({ enum: TipoNovedad, example: TipoNovedad.Vacaciones })
  @IsOptional()
  @IsEnum(TipoNovedad)
  tipo?: TipoNovedad;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  soporte_url?: string;
}