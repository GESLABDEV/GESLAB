'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { MallaDetail } from '@/lib/types/schedules';
import { formatHora } from '@/lib/types/shift-templates';
import { useUsers } from '@/hooks/useUsers';

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

export default function MallaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [malla, setMalla] = useState<MallaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { usersById } = useUsers();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await apiFetch<MallaDetail>(`/schedules/${id}`);
        if (!cancelled) setMalla(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError('Malla no encontrada.');
        } else if (err instanceof ApiError && err.status === 403) {
          setError('No tienes permiso para ver esta malla.');
        } else {
          setError('No se pudo cargar la malla.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="p-8 text-sm text-mist/50">Cargando...</p>;
  }
  if (error || !malla) {
    return <p className="p-8 text-sm text-danger">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/mallas" className="text-sm text-sky hover:underline">
        ← Volver a Mallas
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-mist">
        {malla.departamento.nombre}
      </h1>
      <p className="mt-1 text-sm text-mist/50">
        {malla.frecuencia} · Creada por {malla.creador.nombre} ·{' '}
        <span className="text-warning">{malla.estado}</span>
      </p>
      <div className="mt-6 rounded-xl border border-surface bg-surface/60 p-4">
        <p className="text-sm text-mist/70">
          {malla.turnos.length} turnos generados
        </p>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface bg-surface/60 text-left text-mist/50">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Horario</th>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {malla.turnos.map((turno) => (
              <tr
                key={turno.id_turno}
                className={`border-b border-surface/60 last:border-0 ${
                  turno.cst_conflicto ? 'bg-danger/10' : ''
                }`}
              >
                <td className="px-4 py-3 text-mist/80">
                  {formatFecha(turno.fecha)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-mist/80">
                  {formatHora(turno.hora_inicio)} → {formatHora(turno.hora_fin)}
                </td>
                <td className="px-4 py-3 text-mist/60">
                  {usersById.get(turno.id_usuario)?.nombre ??
                    `Usuario #${turno.id_usuario}`}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-mist/10 px-2.5 py-0.5 text-xs text-mist/60">
                    {turno.estado}
                  </span>
                  {turno.cst_conflicto && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-danger/15 px-2.5 py-0.5 text-xs text-danger">
                      Conflicto
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
