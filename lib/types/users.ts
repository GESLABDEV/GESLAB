// Contrato confirmado en Swagger — GET /users?page=&limit=&search=
// Ver CONTEXTO_FRONTEND.md para el ejemplo completo de respuesta.

import type { Rol } from './auth';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  id_departamento: number | null;
  id_moderador: number | null;
  creado_en: string;
}

export interface UsersListResponse {
  data: Usuario[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
