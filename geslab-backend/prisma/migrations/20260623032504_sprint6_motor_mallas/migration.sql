/*
  Warnings:

  - The values [Programado,En Curso,Completado,Cancelado] on the enum `EstadoTurno` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoTurno_new" AS ENUM ('Pendiente', 'Confirmado', 'Conflicto');
ALTER TABLE "public"."turnos" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "turnos" ALTER COLUMN "estado" TYPE "EstadoTurno_new" USING ("estado"::text::"EstadoTurno_new");
ALTER TYPE "EstadoTurno" RENAME TO "EstadoTurno_old";
ALTER TYPE "EstadoTurno_new" RENAME TO "EstadoTurno";
DROP TYPE "public"."EstadoTurno_old";
ALTER TABLE "turnos" ALTER COLUMN "estado" SET DEFAULT 'Pendiente';
COMMIT;

-- AlterEnum
ALTER TYPE "FrecuenciaMalla" ADD VALUE 'Personalizada';

-- AlterTable
ALTER TABLE "turnos" ADD COLUMN     "cst_conflicto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cst_detalle" TEXT,
ALTER COLUMN "estado" SET DEFAULT 'Pendiente';

-- CreateTable
CREATE TABLE "plantillas_turno" (
    "id_plantilla" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_creador" INTEGER NOT NULL,

    CONSTRAINT "plantillas_turno_pkey" PRIMARY KEY ("id_plantilla")
);

-- AddForeignKey
ALTER TABLE "plantillas_turno" ADD CONSTRAINT "plantillas_turno_id_creador_fkey" FOREIGN KEY ("id_creador") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
