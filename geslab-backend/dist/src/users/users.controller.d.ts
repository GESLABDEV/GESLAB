import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto, caller: any): Promise<any>;
    findAll(caller: any, page?: string, limit?: string, search?: string): Promise<{
        data: {
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
            id_departamento: number | null;
            id_moderador: number | null;
            id_usuario: number;
            activo: boolean;
            creado_en: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number, caller: any): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.Rol;
        id_departamento: number | null;
        id_moderador: number | null;
        id_usuario: number;
        activo: boolean;
        creado_en: Date;
    }>;
    update(id: number, dto: UpdateUserDto, caller: any): Promise<any>;
    deactivate(id: number, caller: any): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
    activate(id: number, caller: any): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
}
