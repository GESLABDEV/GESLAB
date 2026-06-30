import { ApiProperty } from '@nestjs/swagger';
import { FrecuenciaMalla } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsPositive } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: '2026-07-01', description: 'Fecha de inicio del período (YYYY-MM-DD)' })
  @IsDateString()
  periodo_inicio: string;

  @ApiProperty({ example: '2026-07-31', description: 'Fecha de fin del período (YYYY-MM-DD)' })
  @IsDateString()
  periodo_fin: string;

  @ApiProperty({ enum: FrecuenciaMalla, example: FrecuenciaMalla.Semanal })
  @IsEnum(FrecuenciaMalla)
  frecuencia: FrecuenciaMalla;

  @ApiProperty({ example: 1, description: 'ID del departamento al que pertenece la malla' })
  @IsInt()
  @IsPositive()
  id_departamento: number;
}