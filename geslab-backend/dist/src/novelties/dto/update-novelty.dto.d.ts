import { TipoNovedad } from '@prisma/client';
export declare class UpdateNoveltyDto {
    fecha_inicio?: string;
    fecha_fin?: string;
    descripcion?: string;
    tipo?: TipoNovedad;
    soporte_url?: string;
}
