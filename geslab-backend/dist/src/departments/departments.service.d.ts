import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validarAdministrador;
    findAll(dto: PaginationDto): Promise<import("src/common/interfaces/paginated-response.interface").PaginatedResponse<{
        administrador: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        } | null;
        usuarios: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        }[];
    } & {
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>>;
    findOne(id: number): Promise<{
        administrador: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        } | null;
        usuarios: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        }[];
    } & {
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>;
    create(dto: CreateDepartmentDto): Promise<{
        administrador: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        } | null;
    } & {
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>;
    update(id: number, dto: UpdateDepartmentDto): Promise<{
        before: {
            administrador: {
                id_usuario: number;
                email: string;
                nombre: string;
                rol: import("@prisma/client").$Enums.Rol;
            } | null;
            usuarios: {
                id_usuario: number;
                email: string;
                nombre: string;
                rol: import("@prisma/client").$Enums.Rol;
            }[];
        } & {
            nombre: string;
            id_departamento: number;
            id_administrador: number | null;
        };
        after: {
            administrador: {
                id_usuario: number;
                email: string;
                nombre: string;
                rol: import("@prisma/client").$Enums.Rol;
            } | null;
        } & {
            nombre: string;
            id_departamento: number;
            id_administrador: number | null;
        };
    }>;
    remove(id: number): Promise<{
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>;
}
