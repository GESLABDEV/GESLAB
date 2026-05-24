import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ── REGISTER ──────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // 1. Verificar si el email ya existe
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (existe) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    // 2. Hashear el password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 3. Crear el usuario
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        contrasena_hash: passwordHash, // ← nombre correcto
        rol: dto.rol,
      },
      select: { id_usuario: true, nombre: true, email: true, rol: true }, // ← nombre correcto
    });

    return usuario;
  }

  // ── LOGIN ──────────────────────────────────────────────────
  async login(dto: LoginDto) {
    // 1. Buscar usuario por email
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // 2. Verificar password
    const passwordValido =
      usuario && (await bcrypt.compare(dto.password, usuario.contrasena_hash)); // ← nombre correcto

    if (!usuario || !passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar JWT
    const payload = {
      sub: usuario.id_usuario,   // ← nombre correcto
      email: usuario.email,
      rol: usuario.rol,
      id_moderador: usuario.id_moderador ?? null
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id_usuario: usuario.id_usuario, // ← nombre correcto
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        id_moderador: usuario.id_moderador ?? null

      },
    };
  }

  // ── GET ME ─────────────────────────────────────────────────
  getMe(usuario: any) {
    return usuario;
  }
}
