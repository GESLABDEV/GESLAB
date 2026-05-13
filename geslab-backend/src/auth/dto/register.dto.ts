import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Enum de roles — debe coincidir EXACTAMENTE con tu schema.prisma
export enum RolUsuario {
  SA  = 'SA',
  ADM = 'ADM',
  MOD = 'MOD',
  AGE = 'AGE',
}

export class RegisterDto {
  @ApiProperty({ example: 'Daniel Restrepo' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'daniel@geslab.com' })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.AGE })
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}