import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewRequestDto {
  @ApiPropertyOptional({
    example: 'Revisado. Procede para decisión del ADM.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comentario_moderador?: string;
}