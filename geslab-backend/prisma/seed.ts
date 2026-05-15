import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config(); // ← carga el .env

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // ← mismo setup que PrismaService

async function main() {
  console.log('Iniciando seed...');

  const h = (p: string) => bcrypt.hash(p, 12);

  const sa = await prisma.usuario.upsert({
    where: { email: 'admin@geslab.com' },
    update: { contrasena_hash: await h('Admin1234') },
    create: {
      nombre: 'Super Admin',
      email: 'admin@geslab.com',
      contrasena_hash: await h('Admin1234'),
      rol: Rol.SA,
      activo: true,
      disponible: true,
    },
  });
  console.log('SA creado:', sa.email, sa.id_usuario);

  const d1 = await prisma.departamento.findFirst({ where: { nombre: 'Ventas' } })
    ?? await prisma.departamento.create({ data: { nombre: 'Ventas' } });
  console.log('Dept creado:', d1.id_departamento);

  for (let i = 1; i <= 2; i++) {
    const u = await prisma.usuario.upsert({
      where: { email: `age${i}@geslab.com` },
      update: { contrasena_hash: await h('Admin1234') },
      create: {
        nombre: `Agente ${i}`,
        email: `age${i}@geslab.com`,
        contrasena_hash: await h('Admin1234'),
        rol: Rol.AGE,
        activo: true,
        disponible: true,
        id_departamento: d1.id_departamento,
      },
    });
    console.log('AGE creado:', u.email);
  }

  console.log('Seed OK');
}

main()
  .catch((e) => { console.error('ERROR SEED:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());