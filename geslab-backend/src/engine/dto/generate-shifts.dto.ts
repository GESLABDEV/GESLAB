import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsPositive } from 'class-validator';

export class GenerateShiftsDto {
  @ApiProperty({ example: 1, description: 'ID de la malla (debe estar en estado Borrador)' })
  @IsInt()
  @IsPositive()
  id_malla: number;

  @ApiProperty({ example: 1, description: 'ID de la plantilla de turno (debe estar activa)' })
  @IsInt()
  @IsPositive()
  id_plantilla: number;

  @ApiProperty({
    example: [2, 3, 4],
    description: 'IDs de los usuarios a quienes se asignarán turnos. Deben pertenecer al departamento de la malla.',
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  id_usuarios: number[];
}