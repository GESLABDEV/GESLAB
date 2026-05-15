import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Atención al Cliente' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID del usuario con rol ADM que administrará este departamento',
  })
  @IsOptional()
  @IsInt()
  id_administrador?: number;
}