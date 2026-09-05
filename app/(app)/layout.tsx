'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  // Próximamente: Usuarios, Turnos, Solicitudes — agregar aquí cuando existan sus páginas.
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-sm text-mist/50">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="flex w-56 flex-col border-r border-surface px-4 py-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky/15 text-sky font-mono text-sm font-semibold">
            G
          </div>
          <span className="text-mist font-medium tracking-tight">GESLAB</span>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-surface text-mist'
                    : 'text-mist/60 hover:bg-surface/60 hover:text-mist'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-surface pt-4">
          <p className="truncate text-sm text-mist">{user?.nombre}</p>
          <p className="truncate text-xs text-mist/50">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-md border border-mist/15 px-3 py-1.5 text-sm text-mist/70 transition-colors hover:border-mist/30 hover:text-mist"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
