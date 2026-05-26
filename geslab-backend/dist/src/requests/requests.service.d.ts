import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { DecideRequestDto } from './dto/decide-request.dto';
export declare class RequestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRequestDto, solicitante: any): Promise<{
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    findAll(page?: number, limit?: number, tipo?: string, estado?: string, id_usuario?: number): Promise<{
        data: ({
            solicitante: {
                id_usuario: number;
                rol: import("@prisma/client").$Enums.Rol;
                nombre: string;
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
            estado: import("@prisma/client").$Enums.EstadoSolicitud;
            comentario: string | null;
            tipo: import("@prisma/client").$Enums.TipoSolicitud;
            descripcion: string;
            fecha_solicitud: Date;
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
            estado: import("@prisma/client").$Enums.EstadoSolicitud;
            comentario: string | null;
            tipo: import("@prisma/client").$Enums.TipoSolicitud;
            descripcion: string;
            fecha_solicitud: Date;
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
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    })[]>;
    findOne(id: number, usuario: any): Promise<{
        solicitante: {
            id_usuario: number;
            rol: import("@prisma/client").$Enums.Rol;
            nombre: string;
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
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    review(id: number, dto: ReviewRequestDto, moderador: any): Promise<{
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
    decide(id: number, dto: DecideRequestDto, decisor: any): Promise<{
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        comentario: string | null;
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        descripcion: string;
        fecha_solicitud: Date;
        comentario_moderador: string | null;
        soporte_url: string | null;
        id_solicitud: number;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        id_aprobador: number | null;
    }>;
}
