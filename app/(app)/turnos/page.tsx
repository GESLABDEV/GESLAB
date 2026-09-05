'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { ShiftTemplate } from '@/lib/types/shift-templates';
import { formatHora } from '@/lib/types/shift-templates';

export default function TurnosPage() {
  const [templates, setTemplates] = useState<ShiftTemplate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch<ShiftTemplate[]>('/shift-templates');
        if (!cancelled) setTemplates(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError('No tienes permiso para ver esta sección.');
        } else {
          setError('No se pudo cargar las plantillas de turno.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold text-mist">Turnos</h1>
      <p className="mt-1 text-sm text-mist/50">
        Plantillas de turno disponibles
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface bg-surface/60 text-left text-mist/50">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Horario</th>
              <th className="px-4 py-3 font-medium">Creado por</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-mist/50">
                  Cargando...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-danger">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && templates?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-mist/50">
                  No hay plantillas de turno registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              templates?.map((t) => (
                <tr
                  key={t.id_plantilla}
                  className="border-b border-surface/60 last:border-0"
                >
                  <td className="px-4 py-3 text-mist">{t.nombre}</td>
                  <td className="px-4 py-3 font-mono text-xs text-mist/80">
                    {formatHora(t.hora_inicio)} → {formatHora(t.hora_fin)}
                  </td>
                  <td className="px-4 py-3 text-mist/60">
                    {t.creador.nombre}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                        t.activa
                          ? 'bg-success/15 text-success'
                          : 'bg-mist/10 text-mist/50'
                      }`}
                    >
                      {t.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
