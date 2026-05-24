-- AlterTable
ALTER TABLE "departamentos" ADD COLUMN     "id_administrador" INTEGER;

-- AddForeignKey
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_id_administrador_fkey" FOREIGN KEY ("id_administrador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
