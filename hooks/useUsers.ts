'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { Usuario, UsersListResponse } from '@/lib/types/users';

const LOOKUP_LIMIT = 200;

interface UseUsersResult {
  users: Usuario[];
  usersById: Map<number, Usuario>;
  loading: boolean;
  error: string | null;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch<UsersListResponse>(
          `/users?limit=${LOOKUP_LIMIT}`
        );
        if (!cancelled) setUsers(data.data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError) {
          setError(`No se pudo cargar usuarios (${err.status}).`);
        } else {
          setError('No se pudo cargar usuarios.');
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

  const usersById = useMemo(() => {
    const map = new Map<number, Usuario>();
    for (const u of users) map.set(u.id_usuario, u);
    return map;
  }, [users]);

  return { users, usersById, loading, error };
}
