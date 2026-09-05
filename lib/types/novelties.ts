// Contrato confirmado en Swagger — GET /novelties?page=&limit=&tipo=&id_usuario=
// Probado con usuario ADM (adm1@geslab.com). Nota: SA recibe 403 en este
// endpoint ("Se requiere uno de estos roles: ADM") — confirmado con evidencia,
// no es un bug. tipo y estado se tipan como string porque Swagger no expone
// un enum cerrado; los valores vistos en el seed son:
//   tipo: "Ausencia" | "PermisoRemunerado" | "Incapacidad" | "Vacaciones"
//   estado: "Registrada" | "Activa"
// pero no hay garantía de que sean los únicos — la UI debe tener fallback
// para valores no anticipados (mismo criterio que Solicitudes).

export interface NovedadUsuarioResumen {
  id_usuario: number;
  nombre: string;
  email: string;
}

// registrado_por NO trae email ni rol en la respuesta real de /novelties —
// por eso es un tipo distinto y más angosto que NovedadUsuarioResumen,
// no reusar UsuarioResumen de lib/types/departments.ts acá.
export interface NovedadRegistradoPor {
  id_usuario: number;
  nombre: string;
}

export interface Novedad {
  id_novedad: number;
  tipo: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
  soporte_url: string | null;
  creado_en: string;
  id_usuario: number;
  id_registrado_por: number;
  afectado: NovedadUsuarioResumen;
  registrado_por: NovedadRegistradoPor;
}

export interface NoveltiesListResponse {
  data: Novedad[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
