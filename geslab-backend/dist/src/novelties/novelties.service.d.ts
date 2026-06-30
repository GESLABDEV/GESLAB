import { PrismaService } from '../prisma/prisma.service';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
import { Rol } from '@prisma/client';
interface Caller {
    id_usuario: number;
    rol: Rol;
    acceso_global: boolean;
    id_departamento: number | null;
}
export declare class NoveltiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validarScopeUsuario;
    private validarScopeNovedad;
    create(dto: CreateNoveltyDto, caller: Caller): Promise<{
        id_usuario: number;
        creado_en: Date;
        id_novedad: number;
        tipo: import("@prisma/client").$Enums.TipoNovedad;
        estado: import("@prisma/client").$Enums.EstadoNovedad;
        fecha_inicio: Date;
        fecha_fin: Date;
        descripcion: string;
        soporte_url: string | null;
        id_registrado_por: number;
    }>;
    findAll(caller: Caller, page?: number, limit?: number, tipo?: string, id_usuario?: number): Promise<{
        data: ({
            afectado: {
                id_usuario: number;
                email: string;
                nombre: string;
            };
            registrado_por: {
                id_usuario: number;
                nombre: string;
            };
        } & {
            id_usuario: number;
            creado_en: Date;
            id_novedad: number;
            tipo: import("@prisma/client").$Enums.TipoNovedad;
            estado: import("@prisma/client").$Enums.EstadoNovedad;
            fecha_inicio: Date;
            fecha_fin: Date;
            descripcion: string;
            soporte_url: string | null;
            id_registrado_por: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findTeam(moderadorId: number): Promise<({
        afectado: {
            id_usuario: number;
            email: string;
            nombre: string;
        };
    } & {
        id_usuario: number;
        creado_en: Date;
        id_novedad: number;
        tipo: import("@prisma/client").$Enums.TipoNovedad;
        estado: import("@prisma/client").$Enums.EstadoNovedad;
        fecha_inicio: Date;
        fecha_fin: Date;
        descripcion: string;
        soporte_url: string | null;
        id_registrado_por: number;
    })[]>;
    findOne(id: number, caller?: Caller): Promise<{
        afectado: {
            id_usuario: number;
            email: string;
            nombre: string;
        };
        registrado_por: {
            id_usuario: number;
            nombre: string;
        };
    } & {
        id_usuario: number;
        creado_en: Date;
        id_novedad: number;
        tipo: import("@prisma/client").$Enums.TipoNovedad;
        estado: import("@prisma/client").$Enums.EstadoNovedad;
        fecha_inicio: Date;
        fecha_fin: Date;
        descripcion: string;
        soporte_url: string | null;
        id_registrado_por: number;
    }>;
    update(id: number, dto: UpdateNoveltyDto, caller: Caller): Promise<{
        id_usuario: number;
        creado_en: Date;
        id_novedad: number;
        tipo: import("@prisma/client").$Enums.TipoNovedad;
        estado: import("@prisma/client").$Enums.EstadoNovedad;
        fecha_inicio: Date;
        fecha_fin: Date;
        descripcion: string;
        soporte_url: string | null;
        id_registrado_por: number;
    }>;
    remove(id: number, caller: Caller): Promise<{
        id_usuario: number;
        creado_en: Date;
        id_novedad: number;
        tipo: import("@prisma/client").$Enums.TipoNovedad;
        estado: import("@prisma/client").$Enums.EstadoNovedad;
        fecha_inicio: Date;
        fecha_fin: Date;
        descripcion: string;
        soporte_url: string | null;
        id_registrado_por: number;
    }>;
    findByDepartment(id_departamento: number | null): Promise<({
        afectado: {
            id_usuario: number;
            email: string;
            nombre: string;
        };
    } & {
        id_usuario: number;
        creado_en: Date;
        id_novedad: number;
        tipo: import("@prisma/client").$Enums.TipoNovedad;
        estado: import("@prisma/client").$Enums.EstadoNovedad;
        fecha_inicio: Date;
        fecha_fin: Date;
        descripcion: string;
        soporte_url: string | null;
        id_registrado_por: number;
    })[]>;
}
export {};
