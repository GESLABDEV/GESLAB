import { CreateShiftTemplateDto } from './dto/create-shift-template.dto';
import { UpdateShiftTemplateDto } from './dto/update-shift-template.dto';
import { ShiftTemplatesService } from './shift-templates.service';
export declare class ShiftTemplatesController {
    private readonly service;
    constructor(service: ShiftTemplatesService);
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
    create(dto: CreateShiftTemplateDto, caller: any): Promise<{
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
    update(id: number, dto: UpdateShiftTemplateDto, caller: any): Promise<{
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
    remove(id: number, caller: any): Promise<{
        nombre: string;
        creado_en: Date;
        id_plantilla: number;
        hora_inicio: Date;
        hora_fin: Date;
        activa: boolean;
        id_creador: number;
    }>;
}
