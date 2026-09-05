'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { DepartmentsListResponse } from '@/lib/types/departments';

export default function DepartamentosPage() {
  const [result, setResult] = useState<DepartmentsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch<DepartmentsListResponse>(
          '/departments?page=1&limit=20'
        );
        if (!cancelled) setResult(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError('No tienes permiso para ver esta sección.');
        } else {
          setError('No se pudo cargar la lista de departamentos.');
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
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-xl font-semibold text-mist">Departamentos</h1>
      <p className="mt-1 text-sm text-mist/50">
        Estructura organizacional de GESLAB
      </p>

      {loading && (
        <p className="mt-8 text-sm text-mist/50">Cargando...</p>
      )}

      {!loading && error && (
        <p className="mt-8 text-sm text-danger">{error}</p>
      )}

      {!loading && !error && result?.data.length === 0 && (
        <p className="mt-8 text-sm text-mist/50">
          No hay departamentos registrados.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {result?.data.map((depto) => (
          <div
            key={depto.id_departamento}
            className="rounded-xl border border-surface bg-surface/60 p-5"
          >
            <h2 className="text-base font-medium text-mist">{depto.nombre}</h2>
            <p className="mt-1 text-xs text-mist/50">
              Administrador: {depto.administrador.nombre}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-sky/15 px-2.5 py-0.5 font-mono text-xs text-sky">
                {depto.usuarios.length} usuarios
              </span>
            </div>

            <ul className="mt-3 space-y-1.5">
              {depto.usuarios.map((u) => (
                <li
                  key={u.id_usuario}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-mist/80">{u.nombre}</span>
                  <span className="font-mono text-xs text-mist/40">
                    {u.rol}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
