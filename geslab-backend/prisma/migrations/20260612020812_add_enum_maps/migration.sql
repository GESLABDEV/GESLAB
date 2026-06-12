-- C1: Renombrar valores de enum para legibilidad en BD
-- Usa RENAME VALUE (PostgreSQL 10+) — operación segura, no destruye datos

ALTER TYPE "EstadoTurno"      RENAME VALUE 'EnCurso'               TO 'En Curso';

ALTER TYPE "TipoNovedad"      RENAME VALUE 'PermisoRemunerado'     TO 'Permiso Remunerado';
ALTER TYPE "TipoNovedad"      RENAME VALUE 'PermisoNoRemunerado'   TO 'Permiso No Remunerado';

ALTER TYPE "TipoSolicitud"    RENAME VALUE 'CambioDeTurno'         TO 'Cambio de Turno';
ALTER TYPE "TipoSolicitud"    RENAME VALUE 'PermisoEspecial'       TO 'Permiso Especial';

ALTER TYPE "EstadoSolicitud"  RENAME VALUE 'EnRevision'            TO 'En Revision';

ALTER TYPE "TipoNotificacion" RENAME VALUE 'CambioEstadoSolicitud' TO 'Cambio Estado Solicitud';
ALTER TYPE "TipoNotificacion" RENAME VALUE 'MallaPublicada'        TO 'Malla Publicada';
ALTER TYPE "TipoNotificacion" RENAME VALUE 'EncuestaPublicada'     TO 'Encuesta Publicada';
ALTER TYPE "TipoNotificacion" RENAME VALUE 'AlertaCritica'         TO 'Alerta Critica';
ALTER TYPE "TipoNotificacion" RENAME VALUE 'CuentaDesactivada'     TO 'Cuenta Desactivada';
ALTER TYPE "TipoNotificacion" RENAME VALUE 'CuentaReactivada'      TO 'Cuenta Reactivada';

ALTER TYPE "TipoAlerta"       RENAME VALUE 'BienestarCritico'      TO 'Bienestar Critico';
ALTER TYPE "TipoAlerta"       RENAME VALUE 'BienestarMedio'        TO 'Bienestar Medio';
ALTER TYPE "TipoAlerta"       RENAME VALUE 'BienestarBajo'         TO 'Bienestar Bajo';
ALTER TYPE "TipoAlerta"       RENAME VALUE 'ViolacionCST'          TO 'Violacion CST';