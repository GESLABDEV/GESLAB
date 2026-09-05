'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { CurrentUser } from '@/lib/types/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiFetch<CurrentUser>('/auth/me');
        setUser(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // Sin sesión válida — de vuelta al login
          router.push('/login');
          return;
        }
        setError('No se pudo cargar la información del usuario.');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Cargando...</p>;
  }

  if (error) {
    return <p className="p-8 text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Bienvenido, {user?.nombre} ({user?.rol})
      </p>
      <pre className="mt-4 rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
