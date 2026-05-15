import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(dto: PaginationDto): Promise<import("src/common/interfaces/paginated-response.interface").PaginatedResponse<{
        usuarios: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        }[];
    } & {
        nombre: string;
        id_departamento: number;
    }>>;
    findOne(id: number): Promise<{
        usuarios: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        }[];
    } & {
        nombre: string;
        id_departamento: number;
    }>;
    create(dto: CreateDepartmentDto): Promise<{
        nombre: string;
        id_departamento: number;
    }>;
    update(id: number, dto: UpdateDepartmentDto): Promise<{
        nombre: string;
        id_departamento: number;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        id_departamento: number;
    }>;
}
