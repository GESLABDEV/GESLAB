import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Rol,
  TipoNovedad,
  EstadoNovedad,
  TipoSolicitud,
  EstadoSolicitud,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de GESLAB — Sprint 5 Clean\n');

  const saltRounds = 10;

  // ============================================================
  // BLOQUE 1 — USUARIOS
  // ============================================================
  console.log('👤 [1/4] Sembrando usuarios...');

  const sa = await prisma.usuario.upsert({
    where: { email: 'sa@geslab.com' },
    update: {},
    create: {
      nombre: 'Super Admin',
      email: 'sa@geslab.com',
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
  update: { id_moderador: mod1.id_usuario }, 
  create: {
    nombre: 'Agente Uno',
    email: 'age1@geslab.com',
    contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
    rol: Rol.AGE,
    activo: true,
    id_moderador: mod1.id_usuario,
  },
});

// age
const age2 = await prisma.usuario.upsert({
  where: { email: 'age2@geslab.com' },
  update: { id_moderador: mod1.id_usuario }, 
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

  console.log(`   ✅ SA     : ${sa.email}`);
  console.log(`   ✅ ADM    : ${adm1.email}`);
  console.log(`   ✅ MODs   : ${mod1.email}, ${mod2.email}`);
  console.log(`   ✅ AGEs   : ${age1.email}, ${age2.email}, ${age3.email}, ${age4.email}`);

  // ============================================================
  // BLOQUE 2 — DEPARTAMENTOS
  // ============================================================
  console.log('\n🏢 [2/4] Sembrando departamentos...');

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
  // BLOQUE 3 — NOVEDADES
  // ============================================================
  console.log('\n📬 [3/4] Sembrando novedades...');

  const novedadesSeed = [
    {
      tipo: TipoNovedad.Vacaciones,
      estado: EstadoNovedad.Registrada,
      fecha_inicio: new Date('2026-06-01'),
      fecha_fin: new Date('2026-06-15'),
      descripcion: 'Vacaciones período junio 2026',
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
      descripcion: 'Permiso por cita médica familiar',
      soporte_url: null,
      id_usuario: age3.id_usuario,
      id_registrado_por: adm1.id_usuario,
    },
    {
      tipo: TipoNovedad.Ausencia,
      estado: EstadoNovedad.Registrada,
      fecha_inicio: new Date('2026-06-05'),
      fecha_fin: new Date('2026-06-05'),
      descripcion: 'Ausencia justificada — trámite personal',
      soporte_url: null,
      id_usuario: age4.id_usuario,
      id_registrado_por: adm1.id_usuario,
    },
  ];

  for (const nov of novedadesSeed) {
    const existente = await prisma.novedad.findFirst({
      where: {
        id_usuario: nov.id_usuario,
        tipo: nov.tipo,
        fecha_inicio: nov.fecha_inicio,
      },
    });
    if (!existente) {
      await prisma.novedad.create({ data: nov });
      console.log(`   ✅ Creada [${nov.tipo}] → id_usuario=${nov.id_usuario}`);
    } else {
      console.log(`   ⏭️  Ya existe [${nov.tipo}] → omitida`);
    }
  }

  // ============================================================
  // BLOQUE 4 — SOLICITUDES (CU-04 · Sprint 5)
  //
  //  SOL-A1 → AGE/age1  · Pendiente   · revisor=mod1  ← probar BUG-001
  //  SOL-A2 → AGE/age2  · EnRevision  · revisor=mod1  ← probar decide() Flujo A
  //  SOL-B1 → MOD/mod1  · Pendiente   · sin revisor   ← probar Flujo B
  //  SOL-C1 → ADM/adm1  · Pendiente   · sin revisor   ← probar Flujo C
  //
  //  Clave de negocio para idempotencia:
  //  id_solicitante + tipo + descripcion (fecha_solicitud tiene @default(now()))
  // ============================================================
  console.log('\n📋 [4/4] Sembrando solicitudes (CU-04)...');

  type SolicitudSeed = {
    _key: string;
    tipo: TipoSolicitud;
    descripcion: string;
    estado: EstadoSolicitud;
    id_solicitante: number;
    id_revisor_moderador: number | null;
    comentario_moderador: string | null;
    comentario_rechazo: string | null;   // ← nombre correcto del schema
  };

  const solicitudesSeed: SolicitudSeed[] = [
    {
      _key: 'SOL-A1',
      tipo: TipoSolicitud.CambioDeTurno,          // ← enum correcto
      descripcion: '[SOL-A1] AGE solicita cambio de turno — Flujo A, estado Pendiente',
      estado: EstadoSolicitud.Pendiente,
      id_solicitante: age1.id_usuario,
      id_revisor_moderador: mod1.id_usuario,
      comentario_moderador: null,
      comentario_rechazo: null,
    },
    {
      _key: 'SOL-A2',
      tipo: TipoSolicitud.CambioDeTurno,
      descripcion: '[SOL-A2] AGE solicita cambio de turno — Flujo A, estado EnRevision',
      estado: EstadoSolicitud.EnRevision,
      id_solicitante: age2.id_usuario,
      id_revisor_moderador: mod1.id_usuario,
      comentario_moderador: 'Revisado por MOD. Procede decisión del ADM.',
      comentario_rechazo: null,
    },
    {
      _key: 'SOL-B1',
      tipo: TipoSolicitud.Vacaciones,
      descripcion: '[SOL-B1] MOD solicita vacaciones — Flujo B directo a ADM',
      estado: EstadoSolicitud.Pendiente,
      id_solicitante: mod1.id_usuario,
      id_revisor_moderador: null,
      comentario_moderador: null,
      comentario_rechazo: null,
    },
    {
      _key: 'SOL-C1',
      tipo: TipoSolicitud.Vacaciones,
      descripcion: '[SOL-C1] ADM solicita vacaciones — Flujo C directo a SA',
      estado: EstadoSolicitud.Pendiente,
      id_solicitante: adm1.id_usuario,
      id_revisor_moderador: null,
      comentario_moderador: null,
      comentario_rechazo: null,
    },
  ];

  for (const sol of solicitudesSeed) {
    const { _key, ...data } = sol;
    const existente = await prisma.solicitud.findFirst({
      where: {
        id_solicitante: data.id_solicitante,
        tipo: data.tipo,
        descripcion: data.descripcion,   // descripción única por diseño del seed
      },
    });
    if (!existente) {
      const creada = await prisma.solicitud.create({ data });
      console.log(`   ✅ ${_key} creada (id: ${creada.id_solicitud})`);
    } else {
      console.log(`   ⏭️  ${_key} ya existe (id: ${existente.id_solicitud}) — omitida`);
    }
  }

  console.log('\n✅ Seed Sprint 5 completado.\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 Mapa para el plan de pruebas:');
  console.log('   SOL-A1 → age1@geslab.com  | Pendiente   | revisor: mod1  → caso #2');
  console.log('   SOL-A2 → age2@geslab.com  | EnRevision  | revisor: mod1  → caso #5');
  console.log('   SOL-B1 → mod1@geslab.com  | Pendiente   | sin revisor    → caso #9');
  console.log('   SOL-C1 → adm1@geslab.com  | Pendiente   | sin revisor    → caso #11');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });