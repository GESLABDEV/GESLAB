-- ============================================================
-- Migración A1 — GESLAB Sprint 5
-- Renombra comentario_rechazo → comentario en tabla solicitudes
-- El campo ahora aplica tanto a decisiones Aprobadas como Rechazadas
-- ============================================================

ALTER TABLE "solicitudes" RENAME COLUMN "comentario_rechazo" TO "comentario";
