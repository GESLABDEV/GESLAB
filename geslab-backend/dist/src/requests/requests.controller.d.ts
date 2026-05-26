import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { DecideRequestDto } from './dto/decide-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(dto: CreateRequestDto, user: any): Promise<{
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
    findAll(page?: string, limit?: string, tipo?: string, estado?: string, id_usuario?: string): Promise<{
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
    findMy(user: any, page?: string, limit?: string): Promise<{
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
    findPendingReview(user: any): Promise<({
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
    findOne(id: number, user: any): Promise<{
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
    review(id: number, dto: ReviewRequestDto, user: any): Promise<{
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
    decide(id: number, dto: DecideRequestDto, user: any): Promise<{
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
