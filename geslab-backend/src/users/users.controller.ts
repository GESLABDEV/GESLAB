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
import { Rol } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users — Solo SA
  @Post()
  @Roles(Rol.SA)
  @ApiOperation({ summary: 'Crear un nuevo usuario (Solo SA)' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // GET /users — Solo SA, con paginación y búsqueda
  @Get()
  @Roles(Rol.SA)
  @ApiOperation({ summary: 'Listar todos los usuarios paginados (Solo SA)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, example: 'daniel' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
    );
  }

  // GET /users/:id — SA y ADM
  @Get(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Ver usuario por ID (SA y ADM)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // PATCH /users/:id — SA y ADM
  @Patch(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: 'Actualizar datos de usuario (SA y ADM)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // PATCH /users/:id/deactivate — Solo SA
  @Patch(':id/deactivate')
  @Roles(Rol.SA)
  @ApiOperation({ summary: 'Desactivar usuario — soft delete (Solo SA)' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivate(id);
  }
}