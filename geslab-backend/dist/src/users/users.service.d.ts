import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rol } from '@prisma/client';
interface Caller {
    id_usuario: number;
    rol: Rol;
    acceso_global: boolean;
    id_departamento: number | null;
}
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validarScopeDepto;
    create(dto: CreateUserDto, caller: Caller): Promise<any>;
    findAll(caller: Caller, page?: number, limit?: number, search?: string): Promise<{
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
    findOne(id: number, caller?: Caller): Promise<{
        id_usuario: number;
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
        creado_en: Date;
        id_departamento: number | null;
        id_moderador: number | null;
    }>;
    update(id: number, dto: UpdateUserDto, caller: Caller): Promise<any>;
    deactivate(id: number, caller: Caller): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
    activate(id: number, caller: Caller): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
    private sanitize;
}
export {};
