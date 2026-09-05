// Contrato confirmado en Swagger — GET /departments?page=&limit=

export interface UsuarioResumen {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface Departamento {
  id_departamento: number;
  nombre: string;
  id_administrador: number;
  administrador: UsuarioResumen;
  usuarios: UsuarioResumen[];
}

export interface DepartmentsListResponse {
  data: Departamento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
