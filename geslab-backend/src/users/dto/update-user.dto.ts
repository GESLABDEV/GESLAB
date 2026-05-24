import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Rol } from 'src/common/enums/role.enum';
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['contrasena'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ enum: Rol })
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id_departamento?: number;


  @ApiPropertyOptional({
    nullable: true,
    type: Number,
    description: 'ID del MOD a asignar. Enviar null para desasignar.',
  })
  @IsOptional()
  @ValidateIf((o) => o.id_moderador !== null)
  @IsInt()
  @Min(1)
  id_moderador?: number | null;
}