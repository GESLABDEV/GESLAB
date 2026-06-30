import { NoveltiesService } from './novelties.service';
import { CreateNoveltyDto } from './dto/create-novelty.dto';
import { UpdateNoveltyDto } from './dto/update-novelty.dto';
export declare class NoveltiesController {
    private readonly noveltiesService;
    constructor(noveltiesService: NoveltiesService);
    create(dto: CreateNoveltyDto, caller: any): Promise<{
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
    findAll(caller: any, page?: string, limit?: string, tipo?: string, id_usuario?: string): Promise<{
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
    findTeam(caller: any): Promise<({
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
    findByDepartment(caller: any): Promise<({
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
    findOne(id: number, caller: any): Promise<{
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
    update(id: number, dto: UpdateNoveltyDto, caller: any): Promise<{
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
    remove(id: number, caller: any): Promise<{
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
}
