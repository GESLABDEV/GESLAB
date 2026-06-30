import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { TransitionScheduleDto } from './dto/transition-schedule.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  // ─── GET /schedules ───────────────────────────────────────
  @Get()
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Listar mallas (scoping por rol: ADM Depto ve solo su dpto)' })
  @ApiResponse({ status: 200, description: 'Lista de mallas' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findAll(@CurrentUser() caller: any) {
    return this.service.findAll(caller);
  }

  // ─── GET /schedules/:id ───────────────────────────────────
  @Get(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Ver detalle de una malla con sus turnos' })
  @ApiResponse({ status: 200, description: 'Malla encontrada' })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any,
  ) {
    return this.service.findOne(id, caller);
  }

  // ─── POST /schedules ──────────────────────────────────────
  @Post()
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Crear nueva malla (estado inicial: Borrador)' })
  @ApiResponse({ status: 201, description: 'Malla creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o periodo_fin <= periodo_inicio' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede crear mallas' })
  create(
    @Body() dto: CreateScheduleDto,
    @CurrentUser() caller: any,
  ) {
    return this.service.create(dto, caller);
  }

  // ─── PATCH /schedules/:id ─────────────────────────────────
  @Patch(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Editar malla (solo en Borrador o Ajustando) — respuesta before/after' })
  @ApiResponse({ status: 200, description: 'Malla actualizada — incluye before y after' })
  @ApiResponse({ status: 400, description: 'Estado no editable o datos inválidos' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede editar mallas' })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
    @CurrentUser() caller: any,
  ) {
    return this.service.update(id, dto, caller);
  }

  // ─── DELETE /schedules/:id ────────────────────────────────
  @Delete(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Eliminar malla (solo en estado Borrador)' })
  @ApiResponse({ status: 200, description: 'Malla eliminada' })
  @ApiResponse({ status: 400, description: 'Solo se pueden eliminar mallas en Borrador' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede eliminar mallas' })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any,
  ) {
    return this.service.remove(id, caller);
  }

  // ─── PATCH /schedules/:id/transition ─────────────────────
  @Patch(':id/transition')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Ejecutar transición de estado de la malla' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 400, description: 'Transición inválida o conflictos CST bloqueando publish' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede ejecutar transiciones' })
  @ApiResponse({ status: 404, description: 'Malla no encontrada' })
  transition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TransitionScheduleDto,
    @CurrentUser() caller: any,
  ) {
    return this.service.transition(id, dto, caller);
  }
}