import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        id_usuario: number;
        email: string;
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.Rol;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id_usuario: number;
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    }>;
    getMe(usuario: any): any;
}
