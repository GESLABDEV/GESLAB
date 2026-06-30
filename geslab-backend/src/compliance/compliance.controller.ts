import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { ComplianceService } from './compliance.service';

@ApiTags('Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  // ─── POST /compliance/validate/:id_malla ──────────────────
  @Post('validate/:id_malla')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({
    summary: 'Validar turnos de una malla contra las reglas CST',
    description:
      'Evalúa los turnos generados de la malla indicada contra ConfiguracionST del departamento. ' +
      'Marca cst_conflicto=true en los turnos que violan alguna regla. ' +
      'La operación es idempotente: resetea los flags antes de cada evaluación. ' +
      'No aplica a mallas en estado Publicada.',
  })
  @ApiResponse({ status: 201, description: 'Validación ejecutada — resumen de conflictos' })
  @ApiResponse({ status: 400, description: 'Malla publicada o sin turnos' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede ejecutar validación CST' })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  validate(
    @Param('id_malla', ParseIntPipe) id_malla: number,
    @CurrentUser() caller: any,
  ) {
    return this.service.validate(id_malla, caller);
  }
}