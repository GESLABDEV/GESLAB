import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<any>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
            activo: boolean;
            creado_en: Date;
            id_departamento: number | null;
            id_moderador: number | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        id_usuario: number;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
        creado_en: Date;
        id_departamento: number | null;
        id_moderador: number | null;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
    deactivate(id: number): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
    activate(id: number): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
    private sanitize;
}
