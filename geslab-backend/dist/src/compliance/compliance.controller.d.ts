import { ComplianceService } from './compliance.service';
export declare class ComplianceController {
    private readonly service;
    constructor(service: ComplianceService);
    validate(id_malla: number, caller: any): Promise<{
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
