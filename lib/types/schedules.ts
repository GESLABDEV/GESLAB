// Contratos confirmados en Swagger — GET /schedules, GET /schedules/{id}
// Nota: hora_inicio/hora_fin de los turnos usan la misma convención "UTC de fantasía"
// que las plantillas de turno — ver formatHora() en lib/types/shift-templates.ts

import type { UsuarioResumen } from './departments';

export interface Malla {
  id_malla: number;
  periodo_inicio: string;
  periodo_fin: string;
  frecuencia: string;
  estado: string; // 'Borrador' confirmado; otros estados aún no confirmados en Swagger
  fecha_publicacion: string | null;
  id_departamento: number;
  id_creador: number;
  id_aprobador: number | null;
  departamento: { id_departamento: number; nombre: string };
  creador: UsuarioResumen;
}

export interface Turno {
  id_turno: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string; // 'Pendiente' confirmado
  cst_conflicto: boolean;
  cst_detalle: string | null;
  id_malla: number;
  id_usuario: number;
  id_departamento: number;
}

export interface MallaDetail extends Malla {
  aprobador: UsuarioResumen | null;
  turnos: Turno[];
}
