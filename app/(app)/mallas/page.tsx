'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { Malla } from '@/lib/types/schedules';

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function MallasPage() {
  const [mallas, setMallas] = useState<Malla[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch<Malla[]>('/schedules');
        if (!cancelled) setMallas(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError('No tienes permiso para ver esta sección.');
        } else {
          setError('No se pudo cargar la lista de mallas.');
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
      <h1 className="text-xl font-semibold text-mist">Mallas</h1>
      <p className="mt-1 text-sm text-mist/50">
        Mallas de turnos por departamento y período
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface bg-surface/60 text-left text-mist/50">
              <th className="px-4 py-3 font-medium">Departamento</th>
              <th className="px-4 py-3 font-medium">Período</th>
              <th className="px-4 py-3 font-medium">Frecuencia</th>
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

            {!loading && !error && mallas?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-mist/50">
                  No hay mallas registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              mallas?.map((malla) => (
                <tr
                  key={malla.id_malla}
                  className="border-b border-surface/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/mallas/${malla.id_malla}`}
                      className="text-sky hover:underline"
                    >
                      {malla.departamento.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-mist/80">
                    {formatFecha(malla.periodo_inicio)} →{' '}
                    {formatFecha(malla.periodo_fin)}
                  </td>
                  <td className="px-4 py-3 text-mist/60">
                    {malla.frecuencia}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-xs text-warning">
                      {malla.estado}
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
