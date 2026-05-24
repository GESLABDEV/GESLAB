import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { DecideRequestDto } from './dto/decide-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(dto: CreateRequestDto, user: any): Promise<{
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        descripcion: string;
        soporte_url: string | null;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        comentario_moderador: string | null;
        comentario_rechazo: string | null;
        id_solicitud: number;
        fecha_solicitud: Date;
        id_aprobador: number | null;
    }>;
    findAll(page?: string, limit?: string, tipo?: string, estado?: string, id_usuario?: string): Promise<{
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
            estado: import("@prisma/client").$Enums.EstadoSolicitud;
            descripcion: string;
            soporte_url: string | null;
            id_solicitante: number;
            id_revisor_moderador: number | null;
            comentario_moderador: string | null;
            comentario_rechazo: string | null;
            id_solicitud: number;
            fecha_solicitud: Date;
            id_aprobador: number | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findMy(user: any, page?: string, limit?: string): Promise<{
        data: {
            tipo: import("@prisma/client").$Enums.TipoSolicitud;
            estado: import("@prisma/client").$Enums.EstadoSolicitud;
            descripcion: string;
            soporte_url: string | null;
            id_solicitante: number;
            id_revisor_moderador: number | null;
            comentario_moderador: string | null;
            comentario_rechazo: string | null;
            id_solicitud: number;
            fecha_solicitud: Date;
            id_aprobador: number | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findPendingReview(user: any): Promise<({
        solicitante: {
            id_usuario: number;
            email: string;
            nombre: string;
        };
    } & {
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        descripcion: string;
        soporte_url: string | null;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        comentario_moderador: string | null;
        comentario_rechazo: string | null;
        id_solicitud: number;
        fecha_solicitud: Date;
        id_aprobador: number | null;
    })[]>;
    findOne(id: number, user: any): Promise<{
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
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        descripcion: string;
        soporte_url: string | null;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        comentario_moderador: string | null;
        comentario_rechazo: string | null;
        id_solicitud: number;
        fecha_solicitud: Date;
        id_aprobador: number | null;
    }>;
    review(id: number, dto: ReviewRequestDto, user: any): Promise<{
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        descripcion: string;
        soporte_url: string | null;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        comentario_moderador: string | null;
        comentario_rechazo: string | null;
        id_solicitud: number;
        fecha_solicitud: Date;
        id_aprobador: number | null;
    }>;
    decide(id: number, dto: DecideRequestDto, user: any): Promise<{
        tipo: import("@prisma/client").$Enums.TipoSolicitud;
        estado: import("@prisma/client").$Enums.EstadoSolicitud;
        descripcion: string;
        soporte_url: string | null;
        id_solicitante: number;
        id_revisor_moderador: number | null;
        comentario_moderador: string | null;
        comentario_rechazo: string | null;
        id_solicitud: number;
        fecha_solicitud: Date;
        id_aprobador: number | null;
    }>;
}
