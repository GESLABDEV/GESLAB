import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { DecideRequestDto } from './dto/decide-request.dto';
import { Rol } from '@prisma/client';
interface Caller {
    id_usuario: number;
    rol: Rol;
    acceso_global: boolean;
    id_departamento: number | null;
    id_moderador: number | null;
}
export declare class RequestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validarScopeSolicitud;
    create(dto: CreateRequestDto, solicitante: any): Promise<{
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    findAll(caller: Caller, page?: number, limit?: number, tipo?: string, estado?: string, id_usuario?: number): Promise<{
        data: ({
            solicitante: {
                id_usuario: number;
                nombre: string;
                rol: import("@prisma/client").$Enums.Rol;
            };
            revisor_moderador: {
                id_usuario: number;
                nombre: string;
            } | null;
            aprobador: {
                id_usuario: number;
                nombre: string;
            } | null;
        } & {
            tipo: import("@prisma/client").$Enums.TipoSolicitud;
            descripcion: string;
            fecha_solicitud: Date;
            estado: import("@prisma/client").$Enums.EstadoSolicitud;
            comentario: string | null;
            comentario_moderador: string | null;
            soporte_url: string | null;
            id_solicitud: number;
            id_solicitante: number;
            id_revisor_moderador: number | null;
            id_aprobador: number | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findMy(userId: number, page?: number, limit?: number): Promise<{
        data: {
            tipo: import("@prisma/client").$Enums.TipoSolicitud;
            descripcion: string;
            fecha_solicitud: Date;
            estado: import("@prisma/client").$Enums.EstadoSolicitud;
            comentario: string | null;
            comentario_moderador: string | null;
            soporte_url: string | null;
            id_solicitud: number;
            id_solicitante: number;
            id_revisor_moderador: number | null;
            id_aprobador: number | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findPendingReview(moderadorId: number): Promise<({
        solicitante: {
            id_usuario: number;
            nombre: string;
            email: string;
        };
    } & {
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    })[]>;
    findOne(id: number, caller: any): Promise<{
        solicitante: {
            id_usuario: number;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
            id_departamento: number | null;
        };
        revisor_moderador: {
            id_usuario: number;
            nombre: string;
        } | null;
        aprobador: {
            id_usuario: number;
            nombre: string;
        } | null;
    } & {
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    review(id: number, dto: ReviewRequestDto, moderador: any): Promise<{
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    decide(id: number, dto: DecideRequestDto, decisor: Caller): Promise<{
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    findPendingMod(caller: Caller): Promise<({
        solicitante: {
            id_usuario: number;
            nombre: string;
            email: string;
            id_departamento: number | null;
        };
    } & {
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    })[]>;
}
export {};
