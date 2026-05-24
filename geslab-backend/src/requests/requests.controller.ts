import {
  Body,
  Controller,
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
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { DecideRequestDto } from './dto/decide-request.dto';

@ApiTags('Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // POST /requests — AGE, MOD, ADM crean solicitud
  @Post()
  @Roles(Rol.AGE, Rol.MOD, Rol.ADM)
  @ApiOperation({
    summary: '[AGE/MOD/ADM] Crear solicitud laboral — flujo según rol del JWT',
  })
  create(@Body() dto: CreateRequestDto, @CurrentUser() user: any) {
    return this.requestsService.create(dto, user);
  }

  // GET /requests — ADM y SA ven todas
  @Get()
  @Roles(Rol.ADM, Rol.SA)
  @ApiOperation({ summary: '[ADM/SA] Listar todas las solicitudes con filtros' })
  @ApiQuery({ name: 'page',       required: false, example: 1 })
  @ApiQuery({ name: 'limit',      required: false, example: 20 })
  @ApiQuery({ name: 'tipo',       required: false, example: 'CambioDeTurno' })
  @ApiQuery({ name: 'estado',     required: false, example: 'Pendiente' })
  @ApiQuery({ name: 'id_usuario', required: false, example: 5 })
  findAll(
    @Query('page')       page?: string,
    @Query('limit')      limit?: string,
    @Query('tipo')       tipo?: string,
    @Query('estado')     estado?: string,
    @Query('id_usuario') id_usuario?: string,
  ) {
    return this.requestsService.findAll(
      page       ? parseInt(page)       : 1,
      limit      ? parseInt(limit)      : 20,
      tipo,
      estado,
      id_usuario ? parseInt(id_usuario) : undefined,
    );
  }

  // GET /requests/my — AGE, MOD, ADM ven las suyas
  @Get('my')
  @Roles(Rol.AGE, Rol.MOD, Rol.ADM)
  @ApiOperation({ summary: '[AGE/MOD/ADM] Ver mis propias solicitudes' })
  findMy(
    @CurrentUser() user: any,
    @Query('page')  page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.requestsService.findMy(
      user.id_usuario,
      page  ? parseInt(page)  : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  // GET /requests/pending-review — MOD ve pendientes de su equipo
  @Get('pending-review')
  @Roles(Rol.MOD)
  @ApiOperation({ summary: '[MOD] Ver solicitudes pendientes del equipo' })
  findPendingReview(@CurrentUser() user: any) {
    return this.requestsService.findPendingReview(user.id_usuario);
  }

  // GET /requests/:id — detalle con control de visibilidad
  @Get(':id')
  @Roles(Rol.ADM, Rol.SA, Rol.MOD, Rol.AGE)
  @ApiOperation({ summary: '[ADM/SA/MOD/AGE] Ver detalle — AGE solo las suyas' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.findOne(id, user);
  }

  // PATCH /requests/:id/review — MOD revisa
  @Patch(':id/review')
  @Roles(Rol.MOD)
  @ApiOperation({
    summary: '[MOD] Revisar solicitud → EnRevision (Flujo A)',
  })
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.review(id, dto, user);
  }

  // PATCH /requests/:id/decide — ADM / SA decide
  @Patch(':id/decide')
  @Roles(Rol.ADM, Rol.SA)
  @ApiOperation({
    summary: '[ADM/SA] Decisión final — Aprobada o Rechazada (Flujos A, B, C)',
  })
  decide(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DecideRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.decide(id, dto, user);
  }
}