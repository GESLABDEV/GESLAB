import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin1234', 12);
  
  const sa = await prisma.usuario.upsert({
    where: { email: 'admin@geslab.com' },
    update: { contrasena_hash: hash }, // ← fuerza actualización del hash
    create: {
      nombre: 'Super Admin GESLAB',
      email: 'admin@geslab.com',
      contrasena_hash: hash,
      rol: Rol.SA,
      activo: true,
      disponible: true,
    },
  });
  
  console.log('✅ SA listo:', sa.email, '| id_usuario:', sa.id_usuario);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
