// Contrato confirmado en Swagger — GET /shift-templates
// Nota: hora_inicio/hora_fin vienen como ISO completo con fecha base 1970-01-01,
// el backend las usa solo como "contenedor" de una hora del día.

import type { UsuarioResumen } from './departments';

export interface ShiftTemplate {
  id_plantilla: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  activa: boolean;
  creado_en: string;
  id_creador: number;
  creador: UsuarioResumen;
}

// Extrae solo HH:mm de un ISO como "1970-01-01T06:00:00.000Z"
export function formatHora(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC', // importante: no aplicar timezone local, la hora ya viene en UTC "de fantasía"
  });
}
