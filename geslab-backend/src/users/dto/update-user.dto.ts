import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, ValidateIf } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['contrasena'] as const),
) {
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