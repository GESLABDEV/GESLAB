import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "contrasena">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    id_moderador?: number | null;
}
export {};
