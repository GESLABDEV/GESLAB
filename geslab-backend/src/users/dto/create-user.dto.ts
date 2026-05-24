import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rol } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juan@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Segura1234', minLength: 8 })
  @IsString()
  @MinLength(8)
  contrasena: string;

  @ApiProperty({ enum: Rol, example: Rol.AGE })
  @IsEnum(Rol)
  rol: Rol;

  @ApiPropertyOptional({ example: 1, description: 'ID del departamento (opcional)' })
  @IsOptional()
  id_departamento?: number;
}