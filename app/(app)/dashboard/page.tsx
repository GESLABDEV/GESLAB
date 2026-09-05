'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';

const ROL_LABEL: Record<string, string> = {
  SA: 'Super Administrador',
  ADM: 'Administrador',
  MOD: 'Moderador',
  AGE: 'Agente',
};

export default function DashboardPage() {
  const { user, error } = useCurrentUser();

  if (error) {
    return <p className="p-8 text-sm text-danger">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold text-mist">
        Hola, {user?.nombre.split(' ')[0]}
      </h1>
      <p className="mt-1 text-sm text-mist/50">Bienvenido de vuelta a GESLAB</p>

      <div className="mt-8 rounded-xl border border-surface bg-surface/60 p-6">
        <dl className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-mist/50">Nombre</dt>
            <dd className="mt-0.5 text-mist">{user?.nombre}</dd>
          </div>
          <div>
            <dt className="text-mist/50">Correo</dt>
            <dd className="mt-0.5 text-mist">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-mist/50">Rol</dt>
            <dd className="mt-0.5">
              <span className="inline-flex items-center rounded-full bg-violet/15 px-2.5 py-0.5 font-mono text-xs text-violet">
                {ROL_LABEL[user?.rol ?? ''] ?? user?.rol}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-mist/50">Departamento</dt>
            <dd className="mt-0.5 text-mist">{user?.id_departamento ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-mist/50">Acceso global</dt>
            <dd className="mt-0.5 text-mist">{user?.acceso_global ? 'Sí' : 'No'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
