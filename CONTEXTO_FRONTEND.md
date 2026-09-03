# CONTEXTO_FRONTEND.md

## Estado del Frontend

| Campo | Valor |
|---|---|
| Fase actual | Setup inicial — scaffold Next.js funcionando, sin datos reales aún |
| Última actualización | 2026-09-03 |
| Bloqueadores | Esperando .env de Daniel para levantar el backend localmente |

---

## Backend disponible (referencia rápida)

| Módulo | Base URL | Estado |
|---|---|---|
| Auth | `/auth` | Estable (sin confirmar en Swagger todavía) |
| Usuarios | `/users` | Estable (sin confirmar en Swagger todavía) |
| Departamentos | `/departments` | Estable (sin confirmar en Swagger todavía) |
| Novedades | `/novedades` | Estable (sin confirmar en Swagger todavía) |
| Solicitudes laborales | `/requests` | Estable (sin confirmar en Swagger todavía) |
| Plantillas de turno | `/shift-templates` | Estable Sprint 6 (sin confirmar en Swagger todavía) |
| Mallas / Turnos | `/schedules`, `/shifts` | Estable Sprint 6 (sin confirmar en Swagger todavía) |

> Nota: esta tabla viene de documentación previa, NO ha sido verificada en Swagger en vivo.

---

## Roles y qué ve cada uno (resumen para UI)

| Rol | Alcance de datos | Implicación en UI |
|---|---|---|
| SA | Todo el sistema | Vistas globales, sin filtros de acceso |
| ADM Global | Todo el sistema | Igual que SA en alcance de datos |
| ADM Depto | Solo su departamento | UI debe ocultar/filtrar entidades de otros departamentos |
| MOD | Sus turnos + los de AGE que supervisa | No mostrar toda la nómina, solo su equipo |
| AGE | Solo sus propios datos | Vista individual, sin listas de otros usuarios |

---

## Decisiones de arquitectura frontend tomadas

- Repositorio: mismo repo GESLABDEV/GESLAB, ramas separadas por persona (Daniel, Eric, Dev, Launcher, master) — PENDIENTE confirmar con Daniel.
- Stack: Next.js 16.1.6 (App Router, Turbopack), React 19.2.3, Tailwind CSS 4, TypeScript.
- Estructura de carpetas: por definir, aún scaffold default.

---

## Próximos pasos

- Recibir .env de Daniel y levantar el backend localmente.
- Verificar Swagger en localhost:3001/api/docs.
- Confirmar con Daniel convención de ramas.
- Crear estructura base: /lib/api-client.ts, /hooks/useCurrentUser.ts, /components.
- Confirmar si existe endpoint /auth/me.

---

## Preguntas abiertas para Daniel / backend

- ¿La convención de ramas por persona es la decisión definitiva?
- ¿Existe un endpoint /auth/me?
- ¿Ruta exacta del JSON OpenAPI para generar tipos TypeScript?
- Confirmar versión de Node.js requerida (Eric tiene v26.8.1).
