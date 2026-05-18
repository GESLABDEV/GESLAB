import {
  IsDateString,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  soporte_url?: string;
}