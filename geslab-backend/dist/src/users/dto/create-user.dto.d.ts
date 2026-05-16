import { Rol } from '@prisma/client';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: Rol;
    departmentId?: number;
}
