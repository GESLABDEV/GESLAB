# GESLAB — Wireframe UI v1.0

Prototipo visual del sistema gestor de turnos GESLAB.
Este repositorio contiene la referencia de diseño para el desarrollo en Next.js + NestJS.

---

## 📁 Estructura

```
geslab-wireframe/
├── index.html              ← Estructura HTML (BMO/Daniel)
├── assets/
│   ├── css/
│   │   └── styles.css      ← Estilos visuales (Eric)
│   └── js/
│       └── main.js         ← Lógica de navegación (Daniel)
└── README.md
```

## 👥 Responsables

| Archivo       | Responsable | Rama de trabajo        |
|---------------|-------------|------------------------|
| index.html    | Daniel/BMO  | feature/html-structure |
| styles.css    | Eric        | feature/css-design     |
| main.js       | Daniel      | feature/js-navigation  |

## ⚙️ Roles del prototipo

| Rol              | Pantallas | ID prefijo |
|------------------|-----------|------------|
| Super Admin      | 4         | `sa-`      |
| Administrador    | 6         | `adm-`     |
| Moderador        | 5         | `mod-`     |
| Agente           | 4         | `age-`     |

## 🧩 Modales disponibles

- `modal-notif` — Notificaciones
- `modal-new-user` — Crear usuario (SA)
- `modal-new-novelty` — Registrar novedad (ADM)
- `modal-gen-schedule` — Generar malla con Motor GESLAB (ADM)
- `modal-new-survey` — Crear encuesta de bienestar (SA/ADM)
- `modal-process-req` — Procesar solicitud (MOD)
- `modal-new-request` — Nueva solicitud (AGE)
- `modal-req-shift` — Solicitar cambio de turno (AGE)

## ⚠️ Nota importante

Este wireframe es un **prototipo de referencia visual** en HTML/CSS/JS vanilla.
El código de producción se implementará en **Next.js + NestJS + PostgreSQL**.
No mezclar lógica de producción en este repositorio.

## 🌿 Flujo de trabajo Git

```bash
# 1. Partir siempre desde develop actualizado
git checkout develop && git pull origin develop

# 2. Crear rama de trabajo
git checkout -b feature/nombre-descriptivo

# 3. Commit semántico
git commit -m "tipo: descripción corta"

# 4. Push y Pull Request → base: develop
git push origin feature/nombre-descriptivo
```

### Tipos de commit
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `style:` Cambios de CSS sin lógica
- `refactor:` Reorganización de código
- `docs:` Documentación
- `chore:` Mantenimiento

---

**Stack de producción:** Next.js · NestJS · PostgreSQL · Redis · Docker
**Documentación completa:** Notion — página GESLAB
