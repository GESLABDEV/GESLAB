import {
  Controller, Post, Get, Body, Res, Req,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Rol } from '../common/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK) // por defecto POST devuelve 201, forzamos 200
  @ApiOperation({ summary: 'Iniciar sesión — devuelve cookie httpOnly' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response, // passthrough = NestJS sigue manejando la respuesta
  ) {
    const { access_token, user } = await this.authService.login(dto);

    // Inyectar el JWT en una cookie httpOnly
    response.cookie('access_token', access_token, {
      httpOnly: true,   // JavaScript del navegador NO puede leerla
      secure: false,    // true en producción (requiere HTTPS)
      sameSite: 'lax',  // protección CSRF básica
      maxAge: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
    });

    // Solo devolvemos los datos del usuario (el token ya está en la cookie)
    return { message: 'Login exitoso', user };
  }

  // POST /auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión — limpia la cookie' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Sesión cerrada correctamente' };
  }

  // GET /auth/me — RUTA PROTEGIDA
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // ← Passport verifica la cookie automáticamente
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  getMe(@Req() request: Request) {
    return this.authService.getMe(request.user);
  }

  // ── ENDPOINT DE PRUEBA RBAC (eliminar en Sprint 3) ──
@Get('test-sa')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.SA)
@ApiOperation({ summary: '[PRUEBA] Solo accesible por SA' })
testSA(@CurrentUser() user: any) {
  return { message: `Bienvenido SA: ${user.nombre}`, rol: user.rol };
}
}
