import { PaginationDto } from "../common/dto/pagination.dto";
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsService } from './departments.service';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(pagination: PaginationDto): Promise<import("../common/interfaces/paginated-response.interface").PaginatedResponse<{
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
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>;
    update(id: number, dto: UpdateDepartmentDto): Promise<{
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        id_departamento: number;
        id_administrador: number | null;
    }>;
}
