/* ============================================================
   GESLAB — Wireframe UI v1.0
   Archivo: main.js
   Responsable: Daniel
   Última actualización: Mayo 2026

   MÓDULOS:
   - ROLES: Configuración de roles y pantallas por defecto
   - switchRole(): Cambia el rol activo en el prototipo
   - showScreen(): Muestra la pantalla solicitada
   - switchVtab(): Cambia el panel de pestañas verticales (Reportes)
   - openModal() / closeModal(): Control de modales
   - Listener ESC: Cierra cualquier modal abierto con la tecla Escape
   ============================================================ */


/* ──────────────────────────────────────────────
   CONFIGURACIÓN DE ROLES
   Cada rol tiene: etiqueta, empresa, avatar,
   color de acento y pantalla por defecto.
────────────────────────────────────────────── */
const ROLES = {
  sa:  { label: 'Super Admin',   company: 'Distribuidora El Roble', avatar: 'SA', color: 'var(--sa-color)',  default: 'sa-dashboard'  },
  adm: { label: 'Administrador', company: 'Distribuidora El Roble', avatar: 'AG', color: 'var(--adm-color)', default: 'adm-dashboard' },
  mod: { label: 'Moderadora',    company: 'Distribuidora El Roble', avatar: 'LD', color: 'var(--mod-color)', default: 'mod-dashboard' },
  age: { label: 'Agente',        company: 'Distribuidora El Roble', avatar: 'CO', color: 'var(--age-color)', default: 'age-dashboard' },
};

let currentRole = 'sa';


/* ──────────────────────────────────────────────
   switchRole(role)
   Cambia el rol activo en el wireframe:
   1. Actualiza el tab activo en el role-selector
   2. Actualiza topbar (badge + avatar)
   3. Muestra el sidebar del rol correspondiente
   4. Navega a la pantalla por defecto del rol
────────────────────────────────────────────── */
function switchRole(role) {
  currentRole = role;
  const cfg = ROLES[role];

  // Actualizar tabs del role-selector
  const tabs = document.querySelectorAll('.role-tab');
  const idx  = ['sa', 'adm', 'mod', 'age'].indexOf(role);
  tabs.forEach(t => t.classList.remove('active'));
  if (tabs[idx]) tabs[idx].classList.add('active');

  // Actualizar topbar
  document.getElementById('role-badge').textContent       = cfg.label;
  document.getElementById('user-avatar').textContent      = cfg.avatar;
  document.getElementById('user-avatar').style.background = cfg.color;

  // Mostrar el sidebar del rol activo
  document.querySelectorAll('.role-nav').forEach(n => n.classList.remove('active'));
  document.querySelector(`.role-nav[data-role="${role}"]`).classList.add('active');

  // Limpiar items activos
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));

  // Navegar a la pantalla por defecto del rol
  showScreen(cfg.default, null);

  // Marcar el primer item del sidebar como activo
  const activeNav = document.querySelector(`.role-nav[data-role="${role}"]`);
  const firstItem = activeNav ? activeNav.querySelector('.sb-item') : null;
  if (firstItem) firstItem.classList.add('active');
}


/* ──────────────────────────────────────────────
   showScreen(id, btn)
   Muestra la pantalla con el id dado y actualiza
   el estado activo en el sidebar del rol actual.

   @param id  - ID del elemento <section class="screen">
   @param btn - Botón del sidebar que disparó el evento
                (puede ser null si se llama desde switchRole)
────────────────────────────────────────────── */
function showScreen(id, btn) {
  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // Mostrar la pantalla objetivo
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Actualizar el item activo en el sidebar del rol actual
  const currentNav = document.querySelector(`.role-nav[data-role="${currentRole}"]`);
  if (currentNav) {
    currentNav.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));

    if (btn && currentNav.contains(btn)) {
      // Activar el botón que fue clicado
      btn.classList.add('active');
    } else if (!btn) {
      // Buscar el item que apunta a esta pantalla por su onclick
      currentNav.querySelectorAll('.sb-item').forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(id)) {
          item.classList.add('active');
        }
      });
    }
  }
}


/* ──────────────────────────────────────────────
   switchVtab(group, panelId, btn)
   Controla las pestañas verticales dentro de la
   pantalla de Reportes (ADM).

   @param group   - Prefijo del grupo de paneles (ej: 'rep')
   @param panelId - ID del panel a mostrar
   @param btn     - Botón de pestaña que fue clicado
────────────────────────────────────────────── */
function switchVtab(group, panelId, btn) {
  // Ocultar todos los paneles del grupo
  document.querySelectorAll(`[id^="${group}-"]`).forEach(p => p.classList.remove('active'));

  // Mostrar el panel objetivo
  const target = document.getElementById(panelId);
  if (target) target.classList.add('active');

  // Actualizar el tab activo
  if (btn) {
    const parent = btn.closest('.vtab-nav');
    if (parent) {
      parent.querySelectorAll('.vtab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }
}


/* ──────────────────────────────────────────────
   openModal(id) / closeModal(id)
   Abre o cierra un modal por su ID.
   Los modales usan la clase 'open' para mostrarse.
────────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}


/* ──────────────────────────────────────────────
   LISTENER: Cerrar modales con tecla ESC
────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});


/* ──────────────────────────────────────────────
   INICIALIZACIÓN
   Carga el rol por defecto al abrir el prototipo.
────────────────────────────────────────────── */
switchRole('sa');
