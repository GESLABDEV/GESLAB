import { Rol } from '@prisma/client';
export declare class CreateUserDto {
    nombre: string;
    email: string;
    contrasena: string;
    rol: Rol;
    id_departamento?: number;
    id_moderador?: number | null;
}
