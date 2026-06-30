import { Rol } from '@prisma/client';
import { PrismaService } from "../prisma/prisma.service";
interface Caller {
    id_usuario: number;
    nombre: string;
    email: string;
    rol: Rol;
    id_departamento: number | null;
    id_moderador: number | null;
    acceso_global: boolean;
}
export declare class ComplianceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private assertPuedeEscribir;
    validate(id_malla: number, caller: Caller): Promise<{
        total_turnos: number;
        total_conflictos: number;
        total_limpios: number;
        reglas_aplicadas: {
            max_horas_semana: number;
            min_descanso_horas: number;
            max_dias_seguidos: number;
        };
        conflictos: {
            id_turno: number;
            id_usuario: number;
            fecha: string;
            cst_detalle: string;
        }[];
    }>;
}
export {};
