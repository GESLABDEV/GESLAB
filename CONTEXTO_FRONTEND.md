# CONTEXTO_FRONTEND.md

## Estado del Frontend

| Campo | Valor |
|---|---|
| Fase actual | Setup completo — backend local funcionando, login confirmado, listo para empezar a programar |
| Última actualización | 2026-09-04 |
| Bloqueadores | Ninguno |

---

## Decisión de arquitectura (confirmada por Daniel)

- El frontend se trabaja en el repo `GESLABDEV/GESLAB`, carpeta raíz, sobre la rama `Eric` (NO en `master/geslab-frontend`, que es un experimento separado sin usar).
- El backend (`geslab-backend/`) se corre en una copia local aparte, clonada de `master`, en `~/GESLAB-backend/geslab-backend/`. No se mezcla con la carpeta del frontend.
- Stack frontend: Next.js 16.1.6 (App Router, Turbopack), React 19.2.3, Tailwind CSS 4, TypeScript.

---

## Backend local — cómo levantarlo (ya funciona)

Ubicación: `~/GESLAB-backend/`

```bash
cd ~/GESLAB-backend
docker compose up -d          # Postgres + Redis
cd geslab-backend
npm run start:dev             # backend en localhost:3001
```

Swagger: http://localhost:3001/api/docs

---

## Usuarios de prueba (seed aplicado y confirmado)

| Email | Rol | Departamento | Contraseña |
|---|---|---|---|
| sa@geslab.com | SA | — | Admin1234 |
| adm1@geslab.com | ADM global=true | Atención al Cliente | Admin1234 |
| adm2@geslab.com | ADM global=false | Soporte Técnico | Admin1234 |
| mod1@geslab.com | MOD | Atención al Cliente | Admin1234 |
| mod2@geslab.com | MOD | Soporte Técnico | Admin1234 |
| age1, age2@geslab.com | AGE → mod1 | Atención al Cliente | Admin1234 |
| age3, age4@geslab.com | AGE → mod2 | Soporte Técnico | Admin1234 |

También hay datos de prueba de solicitudes, plantillas de turno y novedades ya cargados.

---

## Contratos de API confirmados en Swagger (verificados, no supuestos)

### POST /auth/login

Request:
```json
{
  "email": "sa@geslab.com",
  "password": "Admin1234"
}
```

Response 200:
```json
{
  "message": "Login exitoso",
  "user": {
    "id_usuario": 1,
    "nombre": "Super Admin",
    "email": "sa@geslab.com",
    "rol": "SA",
    "id_moderador": null
  }
}
```

Notas:
- El JWT viaja en cookie httpOnly llamada `access_token`, NO en el body. Confirmado en DevTools > Application > Cookies.
- CORS ya configurado en el backend para aceptar `http://localhost:3000` con credenciales (`access-control-allow-credentials: true`, `access-control-allow-origin: http://localhost:3000`). No es necesario pedir cambios a Daniel para esto.
- El campo `rol` viene incluido en la respuesta del login. Aun así, se necesita un endpoint de sesión (ej. `/auth/me`) para restaurar el usuario/rol cuando se recarga la página, ya que el JWT no es legible desde JS.

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

## Próximos pasos

- Confirmar si existe endpoint `/auth/me` (o equivalente) en Swagger, para restaurar sesión al recargar página.
- Diseñar cliente HTTP centralizado (`lib/api-client.ts`) con `credentials: 'include'`.
- Construir página de login consumiendo `/auth/login` real.
- Ir confirmando en Swagger, uno por uno, los demás contratos (usuarios, departamentos, solicitudes, turnos) antes de tipar en TypeScript.

---

## Preguntas abiertas para Daniel / backend

- ¿Existe endpoint `/auth/me` o similar para obtener el usuario actual desde la cookie?
- ¿Ruta exacta del JSON OpenAPI (ej. `/api/docs-json`) para generar tipos TypeScript automáticamente?
- Confirmar que `master/geslab-frontend` (con login/middleware/shadcn ya iniciados) definitivamente no se usa — evitar duplicar trabajo si alguien retoma esa carpeta más adelante.

---

## Actualización 2026-09-04 (sesión 2)

### Contratos de API confirmados (nuevos)

**GET /auth/me** — Obtener datos del usuario autenticado

Response 200:
```json
{
  "id_usuario": 1,
  "nombre": "Super Admin",
  "email": "sa@geslab.com",
  "rol": "SA",
  "id_departamento": null,
  "id_moderador": null,
  "acceso_global": false
}
```

Nota: trae más campos que el login (`id_departamento`, `acceso_global`) — clave para la lógica de alcance de datos por rol.

**POST /auth/logout** — Cerrar sesión, limpia la cookie. Contrato aún no probado, pendiente.

**GET /users** y **GET /users/{id}** — confirmados en Swagger con restricciones: `[SA]` todos los usuarios / `[ADM]` solo su departamento. Aún no probados con Try it out.

### Código implementado

- `lib/api-client.ts` — cliente HTTP centralizado con `credentials: 'include'`, clase `ApiError`.
- `lib/types/auth.ts` — tipos `LoginRequest`, `LoginResponse`, `CurrentUser`.
- `app/login/page.tsx` — formulario de login funcional, maneja loading/error/éxito.
- `app/dashboard/page.tsx` — consulta `/auth/me` al cargar, redirige a `/login` si 401, muestra datos del usuario (JSON crudo, temporal).

**Flujo end-to-end verificado:** login → cookie httpOnly → redirect a dashboard → sesión restaurada vía `/auth/me`. Funciona correctamente con usuario SA.

### Próximos pasos

- Probar el flujo completo con los demás roles (ADM, MOD, AGE) para confirmar diferencias en `/auth/me`.
- Implementar `/auth/logout` en el frontend (botón de cerrar sesión).
- Reemplazar el JSON crudo del dashboard por una UI real.
- Extraer un hook `useCurrentUser()` reutilizable, en vez de repetir la lógica de `useEffect` + `apiFetch('/auth/me')` en cada página protegida.
- Confirmar contrato de `GET /users` en Swagger.

---

## Actualización 2026-09-05 (sesión 2, continuación)

### Contratos de API confirmados (nuevos)

**POST /auth/logout** — Cerrar sesión, limpia la cookie httpOnly.

Response 200:
```json
{ "message": "Sesión cerrada correctamente" }
```

Confirmado: tras llamarlo, la cookie `access_token` desaparece del navegador.

### Código implementado

- `hooks/useCurrentUser.ts` — hook reutilizable: obtiene el usuario actual vía `/auth/me`, redirige a `/login` si 401, expone `logout()`.
- `app/dashboard/page.tsx` — refactorizado para usar `useCurrentUser()` en vez de lógica propia. Incluye botón de "Cerrar sesión".

**Flujo completo verificado:** login → cookie → dashboard (sesión restaurada) → logout → cookie eliminada → ruta protegida rebota a /login. Probado con usuario SA.

### Próximos pasos

- Probar el flujo con los demás roles (ADM, MOD, AGE) — confirmar diferencias en `/auth/me` (campos `id_departamento`, `acceso_global`).
- Reemplazar el JSON crudo del dashboard por una UI real.
- Confirmar contrato de `GET /users` en Swagger (ya vimos que existe, restringido por rol).
- Empezar el primer módulo de datos reales (probablemente usuarios o mallas — a decidir con Daniel el orden de prioridad).

---

## Actualización 2026-09-04 (sesión 3 — diseño visual)

### Documentos de proyecto recibidos (fuente: Eric, docs previos al backend)

- **Descripción del Proyecto**: visión completa de GESLAB como HRM. Confirma alcance MUCHO más grande que lo implementado hoy: gestión de rendimiento, relaciones laborales, cumplimiento legal, bienestar y cultura organizacional, mallas por IA.
- **Descripción de Actores**: historias de usuario detalladas por rol (Administrador, Moderador, Agente, Super Administrador), incluyendo un módulo completo de **Bienestar Institucional** (solicitudes, encuestas emocionales, alertas) NO confirmado aún en el backend actual.
- **Paleta de Colores GESLAB** (oficial): tema oscuro.
  - `#0F172A` ink (fondo)
  - `#1E293B` surface (tarjetas/sidebar)
  - `#38BDF8` sky (acento primario)
  - `#A855F7` violet (acento secundario)
  - `#E5E7EB` mist (texto)
  - `#22C55E` success
  - `#F59E0B` warning
  - ⚠️ Sin rojo definido para "Rechazado" (requerido según RI-02 de Descripción de Actores) — usando `#F43F5E` como placeholder, PENDIENTE confirmar con equipo.

### Brecha de alcance detectada (importante)

Los documentos describen módulos que NO están confirmados en el backend actual vía Swagger:
- Bienestar Institucional (solicitudes, encuestas, alertas emocionales)
- Generación de mallas por IA
- Publicaciones institucionales
- Módulo de permisos granulares (Super Admin)

**No se construyen pantallas para estos módulos hasta confirmar en Swagger que el backend los soporta.**

Los "bocetos" (Boceto SA, Boceto Bienestar) en el documento de Actores son wireframes de baja fidelidad con texto mal generado, en modo claro — contradicen la paleta oficial (oscura). Se usan solo como referencia conceptual de layout, no como diseño final.

### Diseño visual implementado

- `app/globals.css` — tokens de color oficiales aplicados vía `@theme inline` de Tailwind 4. Tema oscuro fijo (ya no depende de `prefers-color-scheme`).
- `app/login/page.tsx` — rediseñado con la paleta oficial: fondo ink, tarjeta surface, acento sky en CTA, marca placeholder "G".
- `app/dashboard/page.tsx` — rediseñado: header con marca + logout, tarjeta de datos del usuario con `<dl>` semántico, rol mostrado como píldora violet con fuente mono.

Ambas pantallas visualmente coherentes entre sí. Funcionalidad verificada intacta tras el rediseño (login + logout + restauración de sesión).

### Próximos pasos

- Confirmar con Daniel/equipo si existen o están planeados endpoints para Bienestar Institucional, mallas por IA, publicaciones.
- Confirmar color oficial para estado "Rechazado" (rojo) con el equipo de diseño.
- Construir layout base con sidebar persistente (mencionado en RNF-01 de Descripción de Actores: "navegación lateral persistente") para cuando se agreguen más módulos.
- Aplicar la paleta oficial al resto de pantallas conforme se construyan (usuarios, turnos, solicitudes).

---

## Actualización 2026-09-05 (sesión 4 — layout con sidebar)

### Código implementado

- `app/(app)/layout.tsx` — layout compartido con sidebar persistente (marca, navegación, datos de usuario + logout). Usa route group `(app)` de Next.js: agrupa rutas autenticadas sin afectar la URL.
- `app/(app)/dashboard/page.tsx` — dashboard simplificado, ya no maneja su propio header/logout (delegado al layout).
- Eliminado `app/dashboard/` (duplicado, reemplazado por la versión dentro del route group).

### Cómo agregar una página nueva al sidebar

1. Crear carpeta `app/(app)/nombre-modulo/page.tsx`
2. Agregar `{ href: '/nombre-modulo', label: 'Nombre visible' }` al array `NAV_ITEMS` en `app/(app)/layout.tsx`

### Próximos pasos

- Confirmar contrato de `GET /users` en Swagger (ya visto en la lista, no probado con Try it out).
- Construir primer módulo de datos real (candidato: Usuarios, ya que tiene restricciones de rol claras: [SA] todos, [ADM] solo su departamento — buen caso para practicar el alcance de datos por rol).
- Seguir sugerencia de arquitectura: módulos de solo lectura primero, antes que formularios de escritura.

---

## Actualización 2026-09-05 (sesión 5 — módulo de Usuarios)

### Contratos de API confirmados (nuevos)

**GET /users?page=&limit=&search=** — Lista paginada de usuarios. `[SA]` todos, `[ADM]` solo su departamento (restricción de backend, no de frontend).

Response 200:
```json
{
  "data": [
    {
      "id_usuario": 1,
      "nombre": "Super Admin",
      "email": "sa@geslab.com",
      "rol": "SA",
      "activo": true,
      "id_departamento": null,
      "id_moderador": null,
      "creado_en": "2026-09-04T16:24:37.568Z"
    }
  ],
  "total": 9,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

Nota: campo `activo: boolean` nuevo, no visto antes en `/auth/me` ni `/auth/login`.

**GET /users/{id}** — confirmado en Swagger (`[SA]` cualquier usuario, `[ADM]` solo su departamento), AÚN NO PROBADO. Pendiente para cuando se construya vista de detalle.

### Código implementado

- `lib/types/users.ts` — tipos `Usuario`, `UsersListResponse`.
- `app/(app)/usuarios/page.tsx` — tabla de usuarios con búsqueda (`search`) y paginación (`page`/`limit`), estados de loading/error/vacío, badges de rol (violet) y estado activo/inactivo (success/mist).
- `NAV_ITEMS` en `app/(app)/layout.tsx` actualizado con el link a Usuarios.

Probado end-to-end con usuario SA — lista los 9 usuarios del seed correctamente.

### Próximos pasos

- Probar el módulo de Usuarios logueado como ADM, para confirmar que el backend efectivamente filtra solo su departamento (regla de negocio, no implementada en frontend — el backend decide qué devuelve).
- Construir vista de detalle de usuario usando `GET /users/{id}`.
- Siguiente módulo candidato: Departamentos o Solicitudes (según prioridad que se defina).

---

## Corrección 2026-09-05 — GET /users SÍ filtra correctamente (no era un bug)

La hipótesis de bug anterior fue un error de prueba: probé con `adm1@geslab.com`, que tiene `acceso_global: true` (ve todo el sistema, igual que SA).

**Regla real confirmada con Daniel + evidencia propia:**

El alcance de datos en `GET /users` (y probablemente en otros endpoints) depende del campo **`acceso_global`** del usuario (ver `/auth/me`), no solo del rol `ADM` en sí:

| Usuario | rol | acceso_global | Usuarios que ve en GET /users |
|---|---|---|---|
| sa@geslab.com | SA | — | Los 9 (todos) |
| adm1@geslab.com | ADM | true | Los 9 (todos) |
| adm2@geslab.com | ADM | false | Solo 4 (su departamento: adm2, mod2, age3, age4) |

**Implicación para el frontend:** cuando se construya lógica de UI condicional por "alcance de datos", no basta con mirar `rol === 'ADM'` — hay que considerar también `acceso_global`. Esto aplica a cualquier pantalla futura que muestre datos filtrados por departamento (Turnos, Solicitudes, etc.), no solo a Usuarios.

Confirmado probando ambos ADM: `adm1` (global=true) ve 9 usuarios, `adm2` (global=false) ve 4 usuarios correctamente filtrados por su departamento.

---

## Actualización 2026-09-05 (sesión 5, continuación) — Módulo de Departamentos

### Contratos de API confirmados (nuevos)

**GET /departments?page=&limit=** — Lista de departamentos con administrador y usuarios anidados.

Response 200 (ejemplo resumido):
```json
{
  "data": [
    {
      "id_departamento": 1,
      "nombre": "Atención al Cliente",
      "id_administrador": 2,
      "administrador": { "id_usuario": 2, "nombre": "Administrador Uno", "email": "...", "rol": "ADM" },
      "usuarios": [ /* array de usuarios resumidos */ ]
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### Código implementado

- `lib/types/departments.ts` — tipos `Departamento`, `DepartmentsListResponse`, `UsuarioResumen`.
- `app/(app)/departamentos/page.tsx` — vista de tarjetas (no tabla, por ser solo 2 registros con datos anidados): nombre, administrador, conteo y lista de usuarios por departamento.
- `app/(app)/usuarios/page.tsx` — mejorado: carga departamentos en paralelo y traduce `id_departamento` a nombre real en la tabla. Si el usuario no tiene permiso a `/departments` (ej. AGE), falla silenciosamente y muestra `#id` sin romper la pantalla.
- `NAV_ITEMS` actualizado con "Departamentos".

Probado con usuario SA — ambos departamentos y sus usuarios se muestran correctamente.

### Próximos pasos

- Probar Departamentos/Usuarios con roles MOD y AGE (verificar qué pasa cuando no tienen acceso a /departments).
- Siguiente módulo candidato: Turnos/Mallas (ya cerrado en Sprint 6) o Solicitudes laborales.

---

## Actualización 2026-09-05 (sesión 5, continuación) — Módulo de Turnos (Plantillas)

### Contratos de API confirmados (nuevos)

**GET /shift-templates** — Lista de plantillas de turno. Devuelve un **array plano**, sin paginación (a diferencia de /users y /departments).

Response 200 (ejemplo):
```json
[
  {
    "id_plantilla": 1,
    "nombre": "Turno Mañana",
    "hora_inicio": "1970-01-01T06:00:00.000Z",
    "hora_fin": "1970-01-01T14:00:00.000Z",
    "activa": true,
    "creado_en": "2026-09-04T16:24:38.032Z",
    "id_creador": 2,
    "creador": { "id_usuario": 2, "nombre": "Administrador Uno", "email": "...", "rol": "ADM" }
  }
]
```

Nota importante: `hora_inicio`/`hora_fin` usan fecha base `1970-01-01` como contenedor de una hora del día — al formatear en frontend, forzar `timeZone: 'UTC'` para no aplicar corrimiento de zona horaria local (ver `formatHora()` en `lib/types/shift-templates.ts`).

También documentado en Swagger: respuesta `403 - Acceso denegado` existe para este endpoint, rol exacto con restricción aún no confirmado (no bloqueante, pendiente si aparece en pruebas).

### Código implementado

- `lib/types/shift-templates.ts` — tipo `ShiftTemplate` + helper `formatHora()`.
- `app/(app)/turnos/page.tsx` — tabla de plantillas: nombre, horario (mono, UTC-safe), creador, estado activa/inactiva.
- `NAV_ITEMS` actualizado con "Turnos".

Probado con SA — las 5 plantillas del seed se muestran correctamente, incluyendo "Turno Legado" como inactiva.

### Próximos pasos

- Confirmar contrato de mallas/horarios reales (asignación de plantillas a personas y fechas — probablemente `/schedules`), pendiente de explorar en Swagger.
- Confirmar qué rol(es) exactos reciben 403 en /shift-templates.
- Módulo restante: Solicitudes laborales, Novedades.
