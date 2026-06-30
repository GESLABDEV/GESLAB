import { GenerateShiftsDto } from './dto/generate-shifts.dto';
import { EngineService } from './engine.service';
export declare class EngineController {
    private readonly service;
    constructor(service: EngineService);
    generate(dto: GenerateShiftsDto, caller: any): Promise<{
        total_dias: number;
        total_usuarios: number;
        total_generados: number;
        total_omitidos: number;
        malla: {
            id_malla: number;
            estado: "Borrador";
            periodo_inicio: Date;
            periodo_fin: Date;
            departamento: string;
        };
        plantilla: {
            id_plantilla: number;
            nombre: string;
            hora_inicio: Date;
            hora_fin: Date;
        };
    }>;
}
