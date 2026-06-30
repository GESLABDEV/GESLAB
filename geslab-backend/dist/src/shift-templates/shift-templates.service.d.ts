import { Rol } from '@prisma/client';
import { PrismaService } from "../prisma/prisma.service";
import { CreateShiftTemplateDto } from './dto/create-shift-template.dto';
import { UpdateShiftTemplateDto } from './dto/update-shift-template.dto';
interface Caller {
    id_usuario: number;
    nombre: string;
    email: string;
    rol: Rol;
    id_departamento: number | null;
    id_moderador: number | null;
    acceso_global: boolean;
}
export declare class ShiftTemplatesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private assertPuedeEscribir;
    private assertHoraFinMayorQueInicio;
    findAll(): Promise<({
        creador: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    } & {
        nombre: string;
        creado_en: Date;
        id_plantilla: number;
        hora_inicio: Date;
        hora_fin: Date;
        activa: boolean;
        id_creador: number;
    })[]>;
    findOne(id: number): Promise<{
        creador: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    } & {
        nombre: string;
        creado_en: Date;
        id_plantilla: number;
        hora_inicio: Date;
        hora_fin: Date;
        activa: boolean;
        id_creador: number;
    }>;
    create(dto: CreateShiftTemplateDto, caller: Caller): Promise<{
        creador: {
            id_usuario: number;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    } & {
        nombre: string;
        creado_en: Date;
        id_plantilla: number;
        hora_inicio: Date;
        hora_fin: Date;
        activa: boolean;
        id_creador: number;
    }>;
    update(id: number, dto: UpdateShiftTemplateDto, caller: Caller): Promise<{
        before: {
            creador: {
                id_usuario: number;
                email: string;
                nombre: string;
                rol: import("@prisma/client").$Enums.Rol;
            };
        } & {
            nombre: string;
            creado_en: Date;
            id_plantilla: number;
            hora_inicio: Date;
            hora_fin: Date;
            activa: boolean;
            id_creador: number;
        };
        after: {
            creador: {
                id_usuario: number;
                email: string;
                nombre: string;
                rol: import("@prisma/client").$Enums.Rol;
            };
        } & {
            nombre: string;
            creado_en: Date;
            id_plantilla: number;
            hora_inicio: Date;
            hora_fin: Date;
            activa: boolean;
            id_creador: number;
        };
    }>;
    remove(id: number, caller: Caller): Promise<{
        nombre: string;
        creado_en: Date;
        id_plantilla: number;
        hora_inicio: Date;
        hora_fin: Date;
        activa: boolean;
        id_creador: number;
    }>;
}
export {};
