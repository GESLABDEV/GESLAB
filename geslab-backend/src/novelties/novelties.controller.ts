import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Rol } from '../common/enums/role.enum';
import { NoveltiesService } from './novelties.service';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';

@ApiTags('Novelties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('novelties')
export class NoveltiesController {
  constructor(private readonly noveltiesService: NoveltiesService) {}

  // POST /novelties — ADM registra novedad
  @Post()
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM] Registrar novedad de colaborador' })
  create(
    @Body() dto: CreateNoveltyDto,
    @CurrentUser() user: any,
  ) {
    return this.noveltiesService.create(dto, user.id_usuario);
  }

  // GET /novelties — ADM lista todas (con filtros)
  @Get()
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM] Listar novedades con filtros opcionales' })
  @ApiQuery({ name: 'page',       required: false, example: 1 })
  @ApiQuery({ name: 'limit',      required: false, example: 20 })
  @ApiQuery({ name: 'tipo',       required: false, example: 'Vacaciones' })
  @ApiQuery({ name: 'id_usuario', required: false, example: 5 })
  findAll(
    @Query('page')       page?: string,
    @Query('limit')      limit?: string,
    @Query('tipo')       tipo?: string,
    @Query('id_usuario') id_usuario?: string,
  ) {
    return this.noveltiesService.findAll(
      page       ? parseInt(page)       : 1,
      limit      ? parseInt(limit)      : 20,
      tipo,
      id_usuario ? parseInt(id_usuario) : undefined,
    );
  }

  // GET /novelties/team — MOD ve su equipo
  @Get('team')
  @Roles(Rol.MOD)
  @ApiOperation({ summary: '[MOD] Ver novedades activas de supervisados directos' })
  findTeam(@CurrentUser() user: any) {
    return this.noveltiesService.findTeam(user.id_usuario);
  }

  // GET /novelties/:id — ADM y MOD
  @Get(':id')
  @Roles(Rol.ADM, Rol.MOD)
  @ApiOperation({ summary: '[ADM, MOD] Ver detalle de novedad' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noveltiesService.findOne(id);
  }

  // PATCH /novelties/:id — ADM
  @Patch(':id')
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM] Actualizar novedad (solo si fecha_inicio > hoy)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoveltyDto,
  ) {
    return this.noveltiesService.update(id, dto);
  }

  // DELETE /novelties/:id — ADM (soft delete)
  @Delete(':id')
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM] Eliminar novedad (soft delete → estado Eliminada)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noveltiesService.remove(id);
  }
}