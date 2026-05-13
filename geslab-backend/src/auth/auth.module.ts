import type { StringValue } from 'ms';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
    useFactory: () => ({
        secret: process.env.JWT_SECRET!,
        signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as StringValue,
        },
    }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule], // exportamos para que otros módulos puedan usar los guards
})
export class AuthModule {}