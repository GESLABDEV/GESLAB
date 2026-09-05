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
