import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<any>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: {
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
            activo: boolean;
            creado_en: Date;
            id_usuario: number;
            id_departamento: number | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.Rol;
        activo: boolean;
        creado_en: Date;
        id_usuario: number;
        id_departamento: number | null;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
    deactivate(id: number): Promise<{
        message: string;
        id: number;
        activo: boolean;
    }>;
}
