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
import { CreateShiftTemplateDto } from './dto/create-shift-template.dto';
import { UpdateShiftTemplateDto } from './dto/update-shift-template.dto';
import { ShiftTemplatesService } from './shift-templates.service';

@ApiTags('Shift Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shift-templates')
export class ShiftTemplatesController {
  constructor(private readonly service: ShiftTemplatesService) {}

  // ─── GET /shift-templates ─────────────────────────────────
  // Lectura: SA + ADM (Global y Depto)
  @Get()
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Listar todas las plantillas de turno' })
  @ApiResponse({ status: 200, description: 'Lista de plantillas' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findAll() {
    return this.service.findAll();
  }

  // ─── GET /shift-templates/:id ─────────────────────────────
  @Get(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Obtener una plantilla por ID' })
  @ApiResponse({ status: 200, description: 'Plantilla encontrada' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ─── POST /shift-templates ────────────────────────────────
  // Escritura: SA o ADM Global (verificado en service)
  @Post()
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Crear nueva plantilla de turno' })
  @ApiResponse({ status: 201, description: 'Plantilla creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o hora_fin <= hora_inicio' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede crear plantillas' })
  create(
    @Body() dto: CreateShiftTemplateDto,
    @CurrentUser() caller: any,
  ) {
    return this.service.create(dto, caller);
  }

  // ─── PATCH /shift-templates/:id ───────────────────────────
  @Patch(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Actualizar una plantilla de turno (respuesta con before/after)' })
  @ApiResponse({ status: 200, description: 'Plantilla actualizada — incluye before y after' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o hora_fin <= hora_inicio' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede editar plantillas' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShiftTemplateDto,
    @CurrentUser() caller: any,
  ) {
    return this.service.update(id, dto, caller);
  }

  // ─── DELETE /shift-templates/:id ──────────────────────────
  @Delete(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Eliminar una plantilla de turno' })
  @ApiResponse({ status: 200, description: 'Plantilla eliminada' })
  @ApiResponse({ status: 403, description: 'Solo ADM Global puede eliminar plantillas' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any,
  ) {
    return this.service.remove(id, caller);
  }
}