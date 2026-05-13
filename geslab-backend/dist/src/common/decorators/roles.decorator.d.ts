import { Rol } from '../enums/role.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Rol[]) => import("@nestjs/common").CustomDecorator<string>;
