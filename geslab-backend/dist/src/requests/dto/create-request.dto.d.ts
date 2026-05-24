import { TipoSolicitud } from '@prisma/client';
export declare class CreateRequestDto {
    tipo: TipoSolicitud;
    descripcion: string;
    soporte_url?: string;
}
