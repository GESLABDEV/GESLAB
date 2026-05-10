-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SA', 'ADM', 'MOD', 'AGE');

-- CreateEnum
CREATE TYPE "EstadoMalla" AS ENUM ('Borrador', 'Propuesta', 'Ajustando', 'Publicada', 'Rechazada');

-- CreateEnum
CREATE TYPE "FrecuenciaMalla" AS ENUM ('Semanal', 'Quincenal', 'Mensual');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('Programado', 'EnCurso', 'Completado', 'Cancelado');

-- CreateEnum
CREATE TYPE "TipoNovedad" AS ENUM ('Vacaciones', 'Incapacidad', 'PermisoRemunerado', 'PermisoNoRemunerado', 'Ausencia');

-- CreateEnum
CREATE TYPE "EstadoNovedad" AS ENUM ('Registrada', 'Activa', 'Vencida', 'Eliminada');

-- CreateEnum
CREATE TYPE "TipoSolicitud" AS ENUM ('CambioDeTurno', 'Vacaciones', 'PermisoEspecial', 'Otro');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('Pendiente', 'EnRevision', 'Aprobada', 'Rechazada');

-- CreateEnum
CREATE TYPE "EstadoEncuesta" AS ENUM ('Borrador', 'Publicada', 'Cerrada');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('CambioEstadoSolicitud', 'MallaPublicada', 'EncuestaPublicada', 'AlertaCritica', 'CuentaDesactivada', 'CuentaReactivada');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('BienestarCritico', 'BienestarMedio', 'BienestarBajo', 'ViolacionCST');

-- CreateEnum
CREATE TYPE "NivelAlerta" AS ENUM ('Alto', 'Medio', 'Bajo');

-- CreateTable
CREATE TABLE "departamentos" (
    "id_departamento" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "rol" "Rol" NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "id_departamento" INTEGER,
    "id_moderador" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "mallas" (
    "id_malla" SERIAL NOT NULL,
    "periodo_inicio" DATE NOT NULL,
    "periodo_fin" DATE NOT NULL,
    "frecuencia" "FrecuenciaMalla" NOT NULL,
    "estado" "EstadoMalla" NOT NULL DEFAULT 'Borrador',
    "fecha_publicacion" TIMESTAMP(3),
    "id_departamento" INTEGER NOT NULL,
    "id_creador" INTEGER NOT NULL,
    "id_aprobador" INTEGER,

    CONSTRAINT "mallas_pkey" PRIMARY KEY ("id_malla")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id_turno" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'Programado',
    "id_malla" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_departamento" INTEGER NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id_turno")
);

-- CreateTable
CREATE TABLE "novedades" (
    "id_novedad" SERIAL NOT NULL,
    "tipo" "TipoNovedad" NOT NULL,
    "estado" "EstadoNovedad" NOT NULL DEFAULT 'Registrada',
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "soporte_url" VARCHAR(500),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_registrado_por" INTEGER NOT NULL,

    CONSTRAINT "novedades_pkey" PRIMARY KEY ("id_novedad")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id_solicitud" SERIAL NOT NULL,
    "tipo" "TipoSolicitud" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'Pendiente',
    "comentario_rechazo" VARCHAR(1000),
    "comentario_moderador" VARCHAR(1000),
    "soporte_url" VARCHAR(500),
    "id_solicitante" INTEGER NOT NULL,
    "id_revisor_moderador" INTEGER,
    "id_aprobador" INTEGER,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "encuestas" (
    "id_encuesta" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoEncuesta" NOT NULL DEFAULT 'Borrador',
    "target_roles" VARCHAR(50) NOT NULL,
    "questions" JSONB NOT NULL,
    "fecha_publicacion" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_creador" INTEGER NOT NULL,

    CONSTRAINT "encuestas_pkey" PRIMARY KEY ("id_encuesta")
);

-- CreateTable
CREATE TABLE "respuestas_encuesta" (
    "id_respuesta" SERIAL NOT NULL,
    "valor_emocional" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_respuesta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_encuesta" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "respuestas_encuesta_pkey" PRIMARY KEY ("id_respuesta")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referencia_tipo" VARCHAR(50),
    "referencia_id" INTEGER,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id_alerta" SERIAL NOT NULL,
    "tipo" "TipoAlerta" NOT NULL,
    "nivel" "NivelAlerta" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_generacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id_alerta")
);

-- CreateTable
CREATE TABLE "logs_auditoria" (
    "id_log" SERIAL NOT NULL,
    "modulo" VARCHAR(100) NOT NULL,
    "accion" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "referencia_tipo" VARCHAR(50),
    "referencia_id" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "logs_auditoria_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "configuracion_st" (
    "id_config" SERIAL NOT NULL,
    "max_horas_semana" INTEGER NOT NULL DEFAULT 48,
    "min_descanso_horas" INTEGER NOT NULL DEFAULT 12,
    "max_dias_seguidos" INTEGER NOT NULL DEFAULT 6,
    "max_cambios_semana" INTEGER NOT NULL DEFAULT 2,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_departamento" INTEGER NOT NULL,

    CONSTRAINT "configuracion_st_pkey" PRIMARY KEY ("id_config")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "respuestas_encuesta_id_encuesta_id_usuario_key" ON "respuestas_encuesta"("id_encuesta", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_st_id_departamento_key" ON "configuracion_st"("id_departamento");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id_departamento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_moderador_fkey" FOREIGN KEY ("id_moderador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mallas" ADD CONSTRAINT "mallas_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mallas" ADD CONSTRAINT "mallas_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mallas" ADD CONSTRAINT "mallas_id_aprobador_fkey" FOREIGN KEY ("id_aprobador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_id_malla_fkey" FOREIGN KEY ("id_malla") REFERENCES "mallas"("id_malla") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_id_registrado_por_fkey" FOREIGN KEY ("id_registrado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_id_revisor_moderador_fkey" FOREIGN KEY ("id_revisor_moderador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_id_aprobador_fkey" FOREIGN KEY ("id_aprobador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuestas" ADD CONSTRAINT "encuestas_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_id_encuesta_fkey" FOREIGN KEY ("id_encuesta") REFERENCES "encuestas"("id_encuesta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_st" ADD CONSTRAINT "configuracion_st_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;
