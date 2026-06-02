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
  @ApiOperation({ summary: '[ADM Global] Cualquier usuario · [ADM Depto] Solo su departamento' })
  create(
    @Body() dto: CreateNoveltyDto,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.noveltiesService.create(dto, caller);
  }

  // GET /novelties — ADM lista novedades
  @Get()
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM Global] Todas · [ADM Depto] Solo su departamento' })
  @ApiQuery({ name: 'page',       required: false, example: 1 })
  @ApiQuery({ name: 'limit',      required: false, example: 20 })
  @ApiQuery({ name: 'tipo',       required: false, example: 'Vacaciones' })
  @ApiQuery({ name: 'id_usuario', required: false, example: 5 })
  findAll(
    @CurrentUser() caller: any, // ✅ SC
    @Query('page')       page?: string,
    @Query('limit')      limit?: string,
    @Query('tipo')       tipo?: string,
    @Query('id_usuario') id_usuario?: string,
  ) {
    return this.noveltiesService.findAll(
      caller,
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

  // GET /novelties/department — ADM ve novedades de su departamento
  @Get('department')
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM] Ver novedades activas de su departamento' })
  findByDepartment(@CurrentUser() user: any) {
    return this.noveltiesService.findByDepartment(user.id_departamento);
  }

  // GET /novelties/:id — ADM y MOD
  @Get(':id')
  @Roles(Rol.ADM, Rol.MOD)
  @ApiOperation({ summary: '[ADM] Solo su depto · [MOD] Cualquier novedad' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.noveltiesService.findOne(id, caller);
  }

  // PATCH /novelties/:id — ADM
  @Patch(':id')
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM Global] Cualquier novedad · [ADM Depto] Solo su departamento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoveltyDto,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.noveltiesService.update(id, dto, caller);
  }

  // DELETE /novelties/:id — ADM (soft delete)
  @Delete(':id')
  @Roles(Rol.ADM)
  @ApiOperation({ summary: '[ADM Global] Cualquier novedad · [ADM Depto] Solo su departamento' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.noveltiesService.remove(id, caller);
  }
}