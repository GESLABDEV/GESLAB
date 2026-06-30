import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Rol } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GenerateShiftsDto } from './dto/generate-shifts.dto';
import { EngineService } from './engine.service';

@ApiTags('Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('engine')
export class EngineController {
  constructor(private readonly service: EngineService) {}

  // ─── POST /engine/generate ────────────────────────────────
  @Post('generate')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({
    summary: 'Generar turnos automáticamente para una malla',
    description:
      'Dado una malla en Borrador, una plantilla activa y una lista de usuarios del mismo departamento, ' +
      'crea un Turno por cada combinación usuario × día del período. ' +
      'Las combinaciones ya existentes se omiten (idempotente).',
  })
  @ApiResponse({ status: 201, description: 'Turnos generados — resumen con totales' })
  @ApiResponse({ status: 400, description: 'Malla no está en Borrador · Plantilla inactiva · Usuarios fuera del departamento' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede generar turnos' })
  @ApiResponse({ status: 404, description: 'Malla o plantilla no encontrada' })
  generate(
    @Body() dto: GenerateShiftsDto,
    @CurrentUser() caller: any,
  ) {
    return this.service.generate(dto, caller);
  }
}