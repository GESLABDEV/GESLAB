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
import { CurrentUser } from '../common/decorators/current-user.decorator'; // ✅ SC
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users — SA y ADM
  @Post()
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: '[SA, ADM] Crear un nuevo usuario' })
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.usersService.create(dto, caller);
  }

  // GET /users — SA y ADM
  @Get()
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: '[SA] Todos los usuarios · [ADM] Solo su departamento' })
  @ApiQuery({ name: 'page',   required: false, example: 1 })
  @ApiQuery({ name: 'limit',  required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, example: 'daniel' })
  findAll(
    @CurrentUser() caller: any, // ✅ SC
    @Query('page')   page?:   string,
    @Query('limit')  limit?:  string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(
      caller,
      page  ? parseInt(page)  : 1,
      limit ? parseInt(limit) : 20,
      search,
    );
  }

// GET /users/:id — SA y ADM
@Get(':id')
@Roles(Rol.SA, Rol.ADM)
@ApiOperation({ summary: '[SA] Cualquier usuario · [ADM] Solo su departamento' })
findOne(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() caller: any, // ✅ SC
) {
  return this.usersService.findOne(id, caller);
}

  // PATCH /users/:id — SA y ADM
  @Patch(':id')
  @Roles(Rol.SA, Rol.ADM)
  @ApiOperation({ summary: '[SA] Cualquier usuario · [ADM] Solo su departamento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.usersService.update(id, dto, caller);
  }

  // PATCH /users/:id/deactivate — SA y ADM
  @Patch(':id/deactivate')
  @Roles(Rol.SA, Rol.ADM) // ✅ SC — ADM puede desactivar usuarios de su depto
  @ApiOperation({ summary: '[SA] Cualquier usuario · [ADM] Solo su departamento' })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.usersService.deactivate(id, caller);
  }

  // PATCH /users/:id/activate — SA y ADM
  @Patch(':id/activate')
  @Roles(Rol.SA, Rol.ADM) // ✅ SC — ADM puede reactivar usuarios de su depto
  @ApiOperation({ summary: '[SA] Cualquier usuario · [ADM] Solo su departamento' })
  activate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() caller: any, // ✅ SC
  ) {
    return this.usersService.activate(id, caller);
  }
}