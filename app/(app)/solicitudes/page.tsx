'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { RequestsListResponse } from '@/lib/types/requests';

// Colores por estado — se irán completando conforme se confirmen más estados en Swagger.
const ESTADO_STYLE: Record<string, string> = {
  Pendiente: 'bg-warning/15 text-warning',
  EnRevision: 'bg-sky/15 text-sky',
  Aprobada: 'bg-success/15 text-success',
  Rechazada: 'bg-danger/15 text-danger',
};

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function SolicitudesPage() {
  const [result, setResult] = useState<RequestsListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await apiFetch<RequestsListResponse>(
          `/requests?page=${page}&limit=20`
        );
        if (!cancelled) setResult(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError('No tienes permiso para ver esta sección.');
        } else {
          setError('No se pudo cargar las solicitudes.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-xl font-semibold text-mist">Solicitudes</h1>
      <p className="mt-1 text-sm text-mist/50">Solicitudes laborales</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface bg-surface/60 text-left text-mist/50">
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Solicitante</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
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

            {!loading && !error && result?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-mist/50">
                  No hay solicitudes registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              result?.data.map((s) => (
                <tr
                  key={s.id_solicitud}
                  className="border-b border-surface/60 last:border-0"
                >
                  <td className="px-4 py-3 text-mist">{s.tipo}</td>
                  <td className="px-4 py-3 text-mist/70">
                    {s.solicitante.nombre}
                    {s.solicitante.rol && (
                      <span className="ml-1.5 font-mono text-xs text-mist/40">
                        {s.solicitante.rol}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-mist/60">
                    {formatFecha(s.fecha_solicitud)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                        ESTADO_STYLE[s.estado] ?? 'bg-mist/10 text-mist/50'
                      }`}
                    >
                      {s.estado}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {result && result.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-mist/50">
          <span>
            Página {result.page} de {result.totalPages} · {result.total}{' '}
            solicitudes
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-mist/15 px-3 py-1.5 disabled:opacity-30"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= result.totalPages}
              className="rounded-md border border-mist/15 px-3 py-1.5 disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
