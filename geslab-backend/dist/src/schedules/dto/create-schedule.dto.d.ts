import { FrecuenciaMalla } from '@prisma/client';
export declare class CreateScheduleDto {
    periodo_inicio: string;
    periodo_fin: string;
    frecuencia: FrecuenciaMalla;
    id_departamento: number;
}
