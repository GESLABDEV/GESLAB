import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // ← Aquí está la clave: extraemos el JWT de la COOKIE, no del header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Este método se ejecuta DESPUÉS de que Passport verifica la firma del token
  // El objeto 'payload' ya está decodificado y verificado

async validate(payload: any) {
  const usuario = await this.prisma.usuario.findUnique({
    where: { id_usuario: payload.sub }, // ← usa id_usuario
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      rol: true,
      id_departamento: true,
    },
  });

  if (!usuario) {
    throw new UnauthorizedException();
  }

  return usuario;
}
}