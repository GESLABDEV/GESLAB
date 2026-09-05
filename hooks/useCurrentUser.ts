'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { CurrentUser } from '@/lib/types/auth';

interface UseCurrentUserResult {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserResult {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const data = await apiFetch<CurrentUser>('/auth/me');
        if (!cancelled) setUser(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          router.push('/login');
          return;
        }
        setError('No se pudo cargar la información del usuario.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      // Pase lo que pase con la API, limpiamos el estado local y redirigimos.
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return { user, loading, error, logout };
}
