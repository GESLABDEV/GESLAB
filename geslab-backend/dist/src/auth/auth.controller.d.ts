import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id_usuario: number;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
    }>;
    login(dto: LoginDto, response: Response): Promise<{
        message: string;
        user: {
            id_usuario: number;
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    }>;
    logout(response: Response): {
        message: string;
    };
    getMe(request: Request): any;
}
