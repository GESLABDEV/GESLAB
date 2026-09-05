// Contrato confirmado en Swagger — GET /requests?page=&limit=
// Estados vistos hasta ahora: "Pendiente", "EnRevision".
// Pendiente confirmar el resto (probablemente "Aprobada"/"Rechazada" según RI-02).

export interface SolicitanteResumen {
  id_usuario: number;
  nombre: string;
  rol?: string;
}

export interface Solicitud {
  id_solicitud: number;
  tipo: string;
  descripcion: string;
  fecha_solicitud: string;
  estado: string;
  comentario: string | null;
  comentario_moderador: string | null;
  soporte_url: string | null;
  id_solicitante: number;
  id_revisor_moderador: number | null;
  id_aprobador: number | null;
  solicitante: SolicitanteResumen;
  revisor_moderador: SolicitanteResumen | null;
  aprobador: SolicitanteResumen | null;
}

export interface RequestsListResponse {
  data: Solicitud[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
