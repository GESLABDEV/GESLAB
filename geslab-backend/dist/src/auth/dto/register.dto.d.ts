export declare enum RolUsuario {
    SA = "SA",
    ADM = "ADM",
    MOD = "MOD",
    AGE = "AGE"
}
export declare class RegisterDto {
    nombre: string;
    email: string;
    password: string;
    rol: RolUsuario;
}
