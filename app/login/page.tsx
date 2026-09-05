'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { LoginRequest, LoginResponse } from '@/lib/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body: LoginRequest = { email, password };
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log('Login exitoso:', data.user);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'Ocurrió un error al iniciar sesión. Intenta de nuevo.'
        );
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky/15 text-sky font-mono text-sm font-semibold">
            G
          </div>
          <span className="text-mist font-medium tracking-tight">GESLAB</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-surface bg-surface/60 p-8 space-y-5"
        >
          <div>
            <h1 className="text-lg font-semibold text-mist">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-mist/60">
              Gestión de turnos y bienestar laboral
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-mist/80">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-mist/15 bg-ink px-3 py-2 text-sm text-mist placeholder:text-mist/30 outline-none focus:border-sky focus:ring-1 focus:ring-sky"
              placeholder="tu@geslab.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-mist/80">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-mist/15 bg-ink px-3 py-2 text-sm text-mist placeholder:text-mist/30 outline-none focus:border-sky focus:ring-1 focus:ring-sky"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-sky px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
