'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { UsersListResponse } from '@/lib/types/users';

const ROL_LABEL: Record<string, string> = {
  SA: 'Super Administrador',
  ADM: 'Administrador',
  MOD: 'Moderador',
  AGE: 'Agente',
};

export default function UsuariosPage() {
  const [result, setResult] = useState<UsersListResponse | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '20',
          ...(search ? { search } : {}),
        });
        const data = await apiFetch<UsersListResponse>(`/users?${params}`);
        if (!cancelled) setResult(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError('No tienes permiso para ver esta sección.');
        } else {
          setError('No se pudo cargar la lista de usuarios.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, search]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-xl font-semibold text-mist">Usuarios</h1>
      <p className="mt-1 text-sm text-mist/50">
        Gestión de usuarios del sistema
      </p>

      <input
        type="search"
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="mt-6 w-full max-w-sm rounded-md border border-mist/15 bg-surface px-3 py-2 text-sm text-mist placeholder:text-mist/30 outline-none focus:border-sky focus:ring-1 focus:ring-sky"
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface bg-surface/60 text-left text-mist/50">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Rol</th>
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
                  No se encontraron usuarios.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              result?.data.map((usuario) => (
                <tr
                  key={usuario.id_usuario}
                  className="border-b border-surface/60 last:border-0"
                >
                  <td className="px-4 py-3 text-mist">{usuario.nombre}</td>
                  <td className="px-4 py-3 text-mist/70">{usuario.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-violet/15 px-2.5 py-0.5 font-mono text-xs text-violet">
                      {ROL_LABEL[usuario.rol] ?? usuario.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                        usuario.activo
                          ? 'bg-success/15 text-success'
                          : 'bg-mist/10 text-mist/50'
                      }`}
                    >
                      {usuario.activo ? 'Activo' : 'Inactivo'}
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
            Página {result.page} de {result.totalPages} · {result.total} usuarios
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
