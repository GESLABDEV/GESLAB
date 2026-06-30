import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShiftTemplateDto {
  @ApiProperty({
    description: 'Nombre descriptivo de la plantilla',
    example: 'Turno Mañana',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres.' })
  nombre: string;

  @ApiProperty({
    description: 'Hora de inicio en formato HH:mm (24h)',
    example: '06:00',
  })
  @IsString()
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria.' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hora_inicio debe tener formato HH:mm (ej: 06:00, 14:30).',
  })
  hora_inicio: string;

  @ApiProperty({
    description: 'Hora de fin en formato HH:mm (24h). Debe ser mayor que hora_inicio.',
    example: '14:00',
  })
  @IsString()
  @IsNotEmpty({ message: 'La hora de fin es obligatoria.' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hora_fin debe tener formato HH:mm (ej: 14:00, 22:00).',
  })
  hora_fin: string;

  @ApiPropertyOptional({
    description: 'Indica si la plantilla está activa y disponible para usar',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'activa debe ser un valor booleano.' })
  activa?: boolean;
}
