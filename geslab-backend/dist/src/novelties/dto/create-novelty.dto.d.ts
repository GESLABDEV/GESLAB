import { TipoNovedad } from '@prisma/client';
export declare class CreateNoveltyDto {
    tipo: TipoNovedad;
    fecha_inicio: string;
    fecha_fin: string;
    descripcion: string;
    soporte_url?: string;
    id_usuario: number;
}
