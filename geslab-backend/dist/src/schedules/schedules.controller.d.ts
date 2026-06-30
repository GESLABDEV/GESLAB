import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { TransitionScheduleDto } from './dto/transition-schedule.dto';
import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly service;
    constructor(service: SchedulesService);
    findAll(caller: any): Promise<({
        departamento: {
            id_departamento: number;
            nombre: string;
        };
        creador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
        aprobador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        } | null;
        _count: {
            turnos: number;
        };
    } & {
        id_malla: number;
        periodo_inicio: Date;
        periodo_fin: Date;
        frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
        estado: import("@prisma/client").$Enums.EstadoMalla;
        fecha_publicacion: Date | null;
        id_departamento: number;
        id_creador: number;
        id_aprobador: number | null;
    })[]>;
    findOne(id: number, caller: any): Promise<{
        departamento: {
            id_departamento: number;
            nombre: string;
        };
        creador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
        aprobador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        } | null;
        turnos: {
            id_malla: number;
            estado: import("@prisma/client").$Enums.EstadoTurno;
            id_departamento: number;
            id_usuario: number;
            id_turno: number;
            fecha: Date;
            hora_inicio: Date;
            hora_fin: Date;
            cst_conflicto: boolean;
            cst_detalle: string | null;
        }[];
    } & {
        id_malla: number;
        periodo_inicio: Date;
        periodo_fin: Date;
        frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
        estado: import("@prisma/client").$Enums.EstadoMalla;
        fecha_publicacion: Date | null;
        id_departamento: number;
        id_creador: number;
        id_aprobador: number | null;
    }>;
    create(dto: CreateScheduleDto, caller: any): Promise<{
        departamento: {
            id_departamento: number;
            nombre: string;
        };
        creador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
    } & {
        id_malla: number;
        periodo_inicio: Date;
        periodo_fin: Date;
        frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
        estado: import("@prisma/client").$Enums.EstadoMalla;
        fecha_publicacion: Date | null;
        id_departamento: number;
        id_creador: number;
        id_aprobador: number | null;
    }>;
    update(id: number, dto: UpdateScheduleDto, caller: any): Promise<{
        before: {
            departamento: {
                id_departamento: number;
                nombre: string;
            };
            creador: {
                nombre: string;
                id_usuario: number;
                email: string;
                rol: import("@prisma/client").$Enums.Rol;
            };
            aprobador: {
                nombre: string;
                id_usuario: number;
                email: string;
                rol: import("@prisma/client").$Enums.Rol;
            } | null;
            turnos: {
                id_malla: number;
                estado: import("@prisma/client").$Enums.EstadoTurno;
                id_departamento: number;
                id_usuario: number;
                id_turno: number;
                fecha: Date;
                hora_inicio: Date;
                hora_fin: Date;
                cst_conflicto: boolean;
                cst_detalle: string | null;
            }[];
        } & {
            id_malla: number;
            periodo_inicio: Date;
            periodo_fin: Date;
            frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
            estado: import("@prisma/client").$Enums.EstadoMalla;
            fecha_publicacion: Date | null;
            id_departamento: number;
            id_creador: number;
            id_aprobador: number | null;
        };
        after: {
            departamento: {
                id_departamento: number;
                nombre: string;
            };
            creador: {
                nombre: string;
                id_usuario: number;
                email: string;
                rol: import("@prisma/client").$Enums.Rol;
            };
            aprobador: {
                nombre: string;
                id_usuario: number;
                email: string;
                rol: import("@prisma/client").$Enums.Rol;
            } | null;
        } & {
            id_malla: number;
            periodo_inicio: Date;
            periodo_fin: Date;
            frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
            estado: import("@prisma/client").$Enums.EstadoMalla;
            fecha_publicacion: Date | null;
            id_departamento: number;
            id_creador: number;
            id_aprobador: number | null;
        };
    }>;
    remove(id: number, caller: any): Promise<{
        id_malla: number;
        periodo_inicio: Date;
        periodo_fin: Date;
        frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
        estado: import("@prisma/client").$Enums.EstadoMalla;
        fecha_publicacion: Date | null;
        id_departamento: number;
        id_creador: number;
        id_aprobador: number | null;
    }>;
    transition(id: number, dto: TransitionScheduleDto, caller: any): Promise<{
        departamento: {
            id_departamento: number;
            nombre: string;
        };
        creador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        };
        aprobador: {
            nombre: string;
            id_usuario: number;
            email: string;
            rol: import("@prisma/client").$Enums.Rol;
        } | null;
    } & {
        id_malla: number;
        periodo_inicio: Date;
        periodo_fin: Date;
        frecuencia: import("@prisma/client").$Enums.FrecuenciaMalla;
        estado: import("@prisma/client").$Enums.EstadoMalla;
        fecha_publicacion: Date | null;
        id_departamento: number;
        id_creador: number;
        id_aprobador: number | null;
    }>;
}
