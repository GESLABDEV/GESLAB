import { Rol } from "../../common/enums/role.enum";
import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "password">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    nombre?: string;
    rol?: Rol;
    id_departamento?: number;
    id_moderador?: number;
}
export {};
