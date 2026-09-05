'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DashboardPage() {
  const { user, loading, error, logout } = useCurrentUser();

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Cargando...</p>;
  }

  if (error) {
    return <p className="p-8 text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <button
          onClick={logout}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cerrar sesión
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Bienvenido, {user?.nombre} ({user?.rol})
      </p>
      <pre className="mt-4 rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
