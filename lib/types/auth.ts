// Contratos confirmados en Swagger — ver CONTEXTO_FRONTEND.md

export type Rol = 'SA' | 'ADM' | 'MOD' | 'AGE';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseUser {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Rol;
  id_moderador: number | null;
}

export interface LoginResponse {
  message: string;
  user: LoginResponseUser;
}

// GET /auth/me — trae más campos que el login (id_departamento, acceso_global)
export interface CurrentUser {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Rol;
  id_departamento: number | null;
  id_moderador: number | null;
  acceso_global: boolean;
}
