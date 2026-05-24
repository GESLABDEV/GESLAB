import { Rol } from "../../common/enums/role.enum";
import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "contrasena">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    nombre?: string;
    email?: string;
    rol?: Rol;
    id_departamento?: number;
    id_moderador?: number | null;
}
export {};
