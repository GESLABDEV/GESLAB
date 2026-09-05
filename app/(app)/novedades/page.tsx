'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { NoveltiesListResponse } from '@/lib/types/novelties';

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Badge de estado: mismo criterio que Solicitudes — colores conocidos para
// estados vistos en el seed, fallback genérico para cualquier otro estado
// que el backend devuelva en el futuro (no romper la UI).
function estadoBadgeClass(estado: string): string {
  switch (estado) {
    case 'Activa':
      return 'bg-warning/15 text-warning';
    case 'Registrada':
      return 'bg-sky/15 text-sky';
    default:
      return 'bg-mist/10 text-mist/60';
  }
}

export default function NovedadesPage() {
  const [data, setData] = useState<NoveltiesListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const result = await apiFetch<NoveltiesListResponse>(
          `/novelties?page=${page}&limit=20`
        );
        if (!cancelled) setError(null);
        if (!cancelled) setData(result);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError(
            'No tienes permiso para ver Novedades (requiere rol ADM).'
          );
        } else {
          setError('No se pudieron cargar las novedades.');
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
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-xl font-semibold text-mist">Novedades</h1>
      <p className="mt-1 text-sm text-mist/50">
        Ausencias, permisos, incapacidades y vacaciones registradas.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-mist/50">Cargando...</p>
      )}

      {!loading && error && (
        <p className="mt-6 text-sm text-danger">{error}</p>
      )}

      {!loading && !error && data && data.data.length === 0 && (
        <p className="mt-6 text-sm text-mist/50">
          No hay novedades registradas.
        </p>
      )}

      {!loading && !error && data && data.data.length > 0 && (
        <>
          <div className="mt-6 overflow-hidden rounded-xl border border-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface bg-surface/60 text-left text-mist/50">
                  <th className="px-4 py-3 font-medium">Afectado</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Periodo</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Registrado por</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((novedad) => (
                  <tr
                    key={novedad.id_novedad}
                    className="border-b border-surface/60 last:border-0"
                  >
                    <td className="px-4 py-3 text-mist/80">
                      {novedad.afectado.nombre}
                    </td>
                    <td className="px-4 py-3 text-mist/80">
                      {novedad.tipo}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-mist/70">
                      {formatFecha(novedad.fecha_inicio)} →{' '}
                      {formatFecha(novedad.fecha_fin)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${estadoBadgeClass(
                          novedad.estado
                        )}`}
                      >
                        {novedad.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-mist/60">
                      {novedad.registrado_por.nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-mist/50">
            <span>
              Página {data.page} de {data.totalPages} · {data.total} en total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.page <= 1}
                className="rounded-lg border border-surface px-3 py-1.5 text-mist/70 disabled:opacity-30"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages, p + 1))
                }
                disabled={data.page >= data.totalPages}
                className="rounded-lg border border-surface px-3 py-1.5 text-mist/70 disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
