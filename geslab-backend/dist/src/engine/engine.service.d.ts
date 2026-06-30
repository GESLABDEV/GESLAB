import { Rol } from '@prisma/client';
import { PrismaService } from "../prisma/prisma.service";
import { GenerateShiftsDto } from './dto/generate-shifts.dto';
interface Caller {
    id_usuario: number;
    nombre: string;
    email: string;
    rol: Rol;
    id_departamento: number | null;
    id_moderador: number | null;
    acceso_global: boolean;
}
export declare class EngineService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private assertPuedeEscribir;
    generate(dto: GenerateShiftsDto, caller: Caller): Promise<{
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
export {};
