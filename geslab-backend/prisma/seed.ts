import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Rol, TipoNovedad, EstadoNovedad } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config(); // ← carga el .env

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // ← mismo setup que PrismaService

async function main() {
  console.log('🌱 Iniciando seed de GESLAB...\n');

  const saltRounds = 10;

  // ============================================================
  // SPRINT 3 — S3-004: Usuarios base
  // ============================================================
  console.log('👤 Sembrando usuarios...');

  const sa = await prisma.usuario.upsert({
    where: { email: 'admin@geslab.com' },
    update: {},
    create: {
      nombre: 'Super Admin',
      email: 'admin@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.SA,
      activo: true,
    },
  });

  const adm1 = await prisma.usuario.upsert({
    where: { email: 'adm1@geslab.com' },
    update: {},
    create: {
      nombre: 'Administrador Uno',
      email: 'adm1@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.ADM,
      activo: true,
    },
  });

  const adm2 = await prisma.usuario.upsert({
    where: { email: 'adm2@geslab.com' },
    update: {},
    create: {
      nombre: 'Administrador Dos',
      email: 'adm2@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.ADM,
      activo: true,
    },
  });

  const mod1 = await prisma.usuario.upsert({
    where: { email: 'mod1@geslab.com' },
    update: {},
    create: {
      nombre: 'Moderador Uno',
      email: 'mod1@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.MOD,
      activo: true,
    },
  });

  const mod2 = await prisma.usuario.upsert({
    where: { email: 'mod2@geslab.com' },
    update: {},
    create: {
      nombre: 'Moderador Dos',
      email: 'mod2@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.MOD,
      activo: true,
    },
  });

  const age1 = await prisma.usuario.upsert({
    where: { email: 'age1@geslab.com' },
    update: {},
    create: {
      nombre: 'Agente Uno',
      email: 'age1@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.AGE,
      activo: true,
      id_moderador: mod1.id_usuario,
    },
  });

  const age2 = await prisma.usuario.upsert({
    where: { email: 'age2@geslab.com' },
    update: {},
    create: {
      nombre: 'Agente Dos',
      email: 'age2@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.AGE,
      activo: true,
      id_moderador: mod1.id_usuario,
    },
  });

  const age3 = await prisma.usuario.upsert({
    where: { email: 'age3@geslab.com' },
    update: {},
    create: {
      nombre: 'Agente Tres',
      email: 'age3@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.AGE,
      activo: true,
      id_moderador: mod2.id_usuario,
    },
  });

  const age4 = await prisma.usuario.upsert({
    where: { email: 'age4@geslab.com' },
    update: {},
    create: {
      nombre: 'Agente Cuatro',
      email: 'age4@geslab.com',
      contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
      rol: Rol.AGE,
      activo: true,
      id_moderador: mod2.id_usuario,
    },
  });

  console.log(`   ✅ SA: ${sa.email}`);
  console.log(`   ✅ ADMs: ${adm1.email}, ${adm2.email}`);
  console.log(`   ✅ MODs: ${mod1.email}, ${mod2.email}`);
  console.log(`   ✅ AGEs: ${age1.email}, ${age2.email}, ${age3.email}, ${age4.email}`);

  // ============================================================
  // SPRINT 3 — S3-004: Departamentos
  // ============================================================
console.log('\n🏢 Sembrando departamentos...');

const dept1 = await (async () => {
  const existente = await prisma.departamento.findFirst({
    where: { nombre: 'Atención al Cliente' },
  });
  if (existente) return existente;
  return prisma.departamento.create({
    data: { nombre: 'Atención al Cliente' },
  });
})();

const dept2 = await (async () => {
  const existente = await prisma.departamento.findFirst({
    where: { nombre: 'Soporte Técnico' },
  });
  if (existente) return existente;
  return prisma.departamento.create({
    data: { nombre: 'Soporte Técnico' },
  });
})();

console.log(`   ✅ ${dept1.nombre} (id: ${dept1.id_departamento})`);
console.log(`   ✅ ${dept2.nombre} (id: ${dept2.id_departamento})`);

  // ============================================================
  // SPRINT 4 — S4-005: Novedades de prueba
  // ============================================================
  // Estrategia: upsert con campo único compuesto por email del agente
  // + tipo + fecha_inicio como "clave de negocio" del seed.
  //
  // Como Novedad no tiene un único campo de negocio, usamos el
  // patrón: buscar primero, crear si no existe.
  // Esto es más seguro que upsert por id (secuencia frágil).
  // ============================================================
  console.log('\n📬 Sembrando novedades de prueba...');

  const novedadesSeed = [
    {
      tipo: TipoNovedad.Vacaciones,
      estado: EstadoNovedad.Registrada,
      fecha_inicio: new Date('2026-06-01'),
      fecha_fin: new Date('2026-06-15'),
      descripcion: 'Vacaciones aprobadas período junio 2026',
      soporte_url: null,
      id_usuario: age1.id_usuario,
      id_registrado_por: adm1.id_usuario,
    },
    {
      tipo: TipoNovedad.Incapacidad,
      estado: EstadoNovedad.Activa,
      fecha_inicio: new Date('2026-05-20'),
      fecha_fin: new Date('2026-05-27'),
      descripcion: 'Incapacidad médica — diagnóstico respiratorio',
      soporte_url: 'https://storage.geslab.app/soportes/incapacidad-001.pdf',
      id_usuario: age2.id_usuario,
      id_registrado_por: adm1.id_usuario,
    },
    {
      tipo: TipoNovedad.PermisoRemunerado,
      estado: EstadoNovedad.Registrada,
      fecha_inicio: new Date('2026-06-20'),
      fecha_fin: new Date('2026-06-20'),
      descripcion: 'Permiso por diligencia personal — cita médica familiar',
      soporte_url: null,
      id_usuario: age3.id_usuario,
      id_registrado_por: adm2.id_usuario,
    },
{
  tipo: TipoNovedad.Ausencia,
  estado: EstadoNovedad.Registrada,
  fecha_inicio: new Date('2026-06-05'),
  fecha_fin: new Date('2026-06-05'),
  descripcion: 'Ausencia justificada — trámite personal',
  soporte_url: null,
  id_usuario: age4.id_usuario,
  id_registrado_por: adm2.id_usuario,
},
  ];

  for (const novedad of novedadesSeed) {
    // Buscar por clave de negocio compuesta: agente + tipo + fecha_inicio
    const existente = await prisma.novedad.findFirst({
      where: {
        id_usuario: novedad.id_usuario,
        tipo: novedad.tipo,
        fecha_inicio: novedad.fecha_inicio,
      },
    });

    if (!existente) {
      await prisma.novedad.create({ data: novedad });
      console.log(`   ✅ Creada: [${novedad.tipo}] para id_usuario=${novedad.id_usuario}`);
    } else {
      console.log(`   ⏭️  Ya existe: [${novedad.tipo}] para id_usuario=${novedad.id_usuario} — omitida`);
    }
  }

  console.log('\n✅ Seed completado exitosamente.\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });