"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Iniciando seed de GESLAB — Sprint 6 (Motor de Mallas)\n');
    const saltRounds = 10;
    console.log('👤 [1/6] Sembrando usuarios...');
    const sa = await prisma.usuario.upsert({
        where: { email: 'sa@geslab.com' },
        update: {},
        create: {
            nombre: 'Super Admin',
            email: 'sa@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.SA,
            activo: true,
            acceso_global: false,
        },
    });
    const adm1 = await prisma.usuario.upsert({
        where: { email: 'adm1@geslab.com' },
        update: { acceso_global: true },
        create: {
            nombre: 'Administrador Uno',
            email: 'adm1@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.ADM,
            activo: true,
            acceso_global: true,
        },
    });
    const adm2 = await prisma.usuario.upsert({
        where: { email: 'adm2@geslab.com' },
        update: { acceso_global: false },
        create: {
            nombre: 'Administrador Dos',
            email: 'adm2@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.ADM,
            activo: true,
            acceso_global: false,
        },
    });
    const mod1 = await prisma.usuario.upsert({
        where: { email: 'mod1@geslab.com' },
        update: {},
        create: {
            nombre: 'Moderador Uno',
            email: 'mod1@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.MOD,
            activo: true,
            acceso_global: false,
        },
    });
    const mod2 = await prisma.usuario.upsert({
        where: { email: 'mod2@geslab.com' },
        update: {},
        create: {
            nombre: 'Moderador Dos',
            email: 'mod2@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.MOD,
            activo: true,
            acceso_global: false,
        },
    });
    const age1 = await prisma.usuario.upsert({
        where: { email: 'age1@geslab.com' },
        update: { id_moderador: mod1.id_usuario },
        create: {
            nombre: 'Agente Uno',
            email: 'age1@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.AGE,
            activo: true,
            acceso_global: false,
            id_moderador: mod1.id_usuario,
        },
    });
    const age2 = await prisma.usuario.upsert({
        where: { email: 'age2@geslab.com' },
        update: { id_moderador: mod1.id_usuario },
        create: {
            nombre: 'Agente Dos',
            email: 'age2@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.AGE,
            activo: true,
            acceso_global: false,
            id_moderador: mod1.id_usuario,
        },
    });
    const age3 = await prisma.usuario.upsert({
        where: { email: 'age3@geslab.com' },
        update: { id_moderador: mod2.id_usuario },
        create: {
            nombre: 'Agente Tres',
            email: 'age3@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.AGE,
            activo: true,
            acceso_global: false,
            id_moderador: mod2.id_usuario,
        },
    });
    const age4 = await prisma.usuario.upsert({
        where: { email: 'age4@geslab.com' },
        update: { id_moderador: mod2.id_usuario },
        create: {
            nombre: 'Agente Cuatro',
            email: 'age4@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.AGE,
            activo: true,
            acceso_global: false,
            id_moderador: mod2.id_usuario,
        },
    });
    console.log(`   ✅ SA     : ${sa.email}`);
    console.log(`   ✅ ADM    : ${adm1.email} (global=true), ${adm2.email} (global=false)`);
    console.log(`   ✅ MODs   : ${mod1.email}, ${mod2.email}`);
    console.log(`   ✅ AGEs   : ${age1.email}, ${age2.email}, ${age3.email}, ${age4.email}`);
    console.log('\n🏢 [2/6] Sembrando departamentos...');
    const dept1Existente = await prisma.departamento.findFirst({
        where: { nombre: 'Atención al Cliente' },
    });
    const dept1 = dept1Existente ?? await prisma.departamento.create({
        data: { nombre: 'Atención al Cliente' },
    });
    const dept2Existente = await prisma.departamento.findFirst({
        where: { nombre: 'Soporte Técnico' },
    });
    const dept2 = dept2Existente ?? await prisma.departamento.create({
        data: { nombre: 'Soporte Técnico' },
    });
    console.log(`   ✅ ${dept1.nombre} (id: ${dept1.id_departamento})`);
    console.log(`   ✅ ${dept2.nombre} (id: ${dept2.id_departamento})`);
    console.log('\n🔗 [2b/6] Asignando departamentos y administradores...');
    await prisma.departamento.update({
        where: { id_departamento: dept1.id_departamento },
        data: { id_administrador: adm1.id_usuario },
    });
    await prisma.departamento.update({
        where: { id_departamento: dept2.id_departamento },
        data: { id_administrador: adm2.id_usuario },
    });
    await prisma.usuario.update({
        where: { id_usuario: adm1.id_usuario },
        data: { id_departamento: dept1.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: adm2.id_usuario },
        data: { id_departamento: dept2.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: mod1.id_usuario },
        data: { id_departamento: dept1.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: mod2.id_usuario },
        data: { id_departamento: dept2.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: age1.id_usuario },
        data: { id_departamento: dept1.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: age2.id_usuario },
        data: { id_departamento: dept1.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: age3.id_usuario },
        data: { id_departamento: dept2.id_departamento },
    });
    await prisma.usuario.update({
        where: { id_usuario: age4.id_usuario },
        data: { id_departamento: dept2.id_departamento },
    });
    console.log(`   ✅ dept1 "Atención al Cliente" → admin: adm1 | usuarios: adm1, mod1, age1, age2`);
    console.log(`   ✅ dept2 "Soporte Técnico"      → admin: adm2 | usuarios: adm2, mod2, age3, age4`);
    console.log('\n📬 [3/6] Sembrando novedades...');
    const novedadesSeed = [
        {
            tipo: client_1.TipoNovedad.Vacaciones,
            estado: client_1.EstadoNovedad.Registrada,
            fecha_inicio: new Date('2026-06-01'),
            fecha_fin: new Date('2026-06-15'),
            descripcion: 'Vacaciones período junio 2026',
            soporte_url: null,
            id_usuario: age1.id_usuario,
            id_registrado_por: adm1.id_usuario,
        },
        {
            tipo: client_1.TipoNovedad.Incapacidad,
            estado: client_1.EstadoNovedad.Activa,
            fecha_inicio: new Date('2026-05-20'),
            fecha_fin: new Date('2026-05-27'),
            descripcion: 'Incapacidad médica — diagnóstico respiratorio',
            soporte_url: 'https://storage.geslab.app/soportes/incapacidad-001.pdf',
            id_usuario: age2.id_usuario,
            id_registrado_por: adm1.id_usuario,
        },
        {
            tipo: client_1.TipoNovedad.PermisoRemunerado,
            estado: client_1.EstadoNovedad.Registrada,
            fecha_inicio: new Date('2026-06-20'),
            fecha_fin: new Date('2026-06-20'),
            descripcion: 'Permiso por cita médica familiar',
            soporte_url: null,
            id_usuario: age1.id_usuario,
            id_registrado_por: adm1.id_usuario,
        },
        {
            tipo: client_1.TipoNovedad.Ausencia,
            estado: client_1.EstadoNovedad.Registrada,
            fecha_inicio: new Date('2026-06-05'),
            fecha_fin: new Date('2026-06-05'),
            descripcion: 'Ausencia justificada — trámite personal',
            soporte_url: null,
            id_usuario: age2.id_usuario,
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
        }
        else {
            console.log(`   ⏭️  Ya existe [${nov.tipo}] → omitida`);
        }
    }
    console.log('\n📋 [4/6] Sembrando solicitudes (CU-04)...');
    const solicitudesSeed = [
        {
            _key: 'SOL-A1',
            tipo: client_1.TipoSolicitud.CambioDeTurno,
            descripcion: '[SOL-A1] AGE solicita cambio de turno — Flujo A, estado Pendiente',
            estado: client_1.EstadoSolicitud.Pendiente,
            id_solicitante: age1.id_usuario,
            id_revisor_moderador: mod1.id_usuario,
            comentario_moderador: null,
            comentario: null,
        },
        {
            _key: 'SOL-A2',
            tipo: client_1.TipoSolicitud.CambioDeTurno,
            descripcion: '[SOL-A2] AGE solicita cambio de turno — Flujo A, estado EnRevision',
            estado: client_1.EstadoSolicitud.EnRevision,
            id_solicitante: age2.id_usuario,
            id_revisor_moderador: mod1.id_usuario,
            comentario_moderador: 'Revisado por MOD. Procede decisión del ADM.',
            comentario: null,
        },
        {
            _key: 'SOL-B1',
            tipo: client_1.TipoSolicitud.Vacaciones,
            descripcion: '[SOL-B1] MOD solicita vacaciones — Flujo B directo a ADM',
            estado: client_1.EstadoSolicitud.Pendiente,
            id_solicitante: mod1.id_usuario,
            id_revisor_moderador: null,
            comentario_moderador: null,
            comentario: null,
        },
        {
            _key: 'SOL-C1',
            tipo: client_1.TipoSolicitud.Vacaciones,
            descripcion: '[SOL-C1] ADM solicita vacaciones — Flujo C directo a SA',
            estado: client_1.EstadoSolicitud.Pendiente,
            id_solicitante: adm1.id_usuario,
            id_revisor_moderador: null,
            comentario_moderador: null,
            comentario: null,
        },
    ];
    for (const sol of solicitudesSeed) {
        const { _key, ...data } = sol;
        const existente = await prisma.solicitud.findFirst({
            where: {
                id_solicitante: data.id_solicitante,
                tipo: data.tipo,
                descripcion: data.descripcion,
            },
        });
        if (!existente) {
            const creada = await prisma.solicitud.create({ data });
            console.log(`   ✅ ${_key} creada (id: ${creada.id_solicitud})`);
        }
        else {
            console.log(`   ⏭️  ${_key} ya existe (id: ${existente.id_solicitud}) — omitida`);
        }
    }
    console.log('\n🗓️  [5/6] Sembrando plantillas de turno...');
    const plantillasSeed = [
        {
            nombre: 'Turno Mañana',
            hora_inicio: new Date('1970-01-01T06:00:00.000Z'),
            hora_fin: new Date('1970-01-01T14:00:00.000Z'),
            activa: true,
            id_creador: adm1.id_usuario,
        },
        {
            nombre: 'Turno Tarde',
            hora_inicio: new Date('1970-01-01T14:00:00.000Z'),
            hora_fin: new Date('1970-01-01T22:00:00.000Z'),
            activa: true,
            id_creador: adm1.id_usuario,
        },
        {
            nombre: 'Turno Diurno',
            hora_inicio: new Date('1970-01-01T08:00:00.000Z'),
            hora_fin: new Date('1970-01-01T16:00:00.000Z'),
            activa: true,
            id_creador: adm1.id_usuario,
        },
        {
            nombre: 'Turno Mixto',
            hora_inicio: new Date('1970-01-01T10:00:00.000Z'),
            hora_fin: new Date('1970-01-01T18:00:00.000Z'),
            activa: true,
            id_creador: adm1.id_usuario,
        },
        {
            nombre: 'Turno Legado',
            hora_inicio: new Date('1970-01-01T07:00:00.000Z'),
            hora_fin: new Date('1970-01-01T12:00:00.000Z'),
            activa: false,
            id_creador: adm1.id_usuario,
        },
    ];
    for (const pt of plantillasSeed) {
        const existente = await prisma.plantillaTurno.findFirst({
            where: {
                nombre: pt.nombre,
                id_creador: pt.id_creador,
            },
        });
        if (!existente) {
            const creada = await prisma.plantillaTurno.create({ data: pt });
            const ini = pt.hora_inicio.toISOString().slice(11, 16);
            const fin = pt.hora_fin.toISOString().slice(11, 16);
            console.log(`   ✅ [id:${creada.id_plantilla}] ${creada.nombre.padEnd(16)} | ${ini} → ${fin} | activa: ${pt.activa}`);
        }
        else {
            console.log(`   ⏭️  "${pt.nombre}" ya existe (id: ${existente.id_plantilla}) — omitida`);
        }
    }
    console.log('\n✅ Seed Sprint 6 (Motor de Mallas) completado.\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 Mapa de usuarios:');
    console.log('   sa@geslab.com   → SA              | sin depto');
    console.log('   adm1@geslab.com → ADM global=true | dept1 Atención al Cliente');
    console.log('   adm2@geslab.com → ADM global=false| dept2 Soporte Técnico');
    console.log('   mod1@geslab.com → MOD             | dept1');
    console.log('   mod2@geslab.com → MOD             | dept2');
    console.log('   age1@geslab.com → AGE → mod1      | dept1');
    console.log('   age2@geslab.com → AGE → mod1      | dept1');
    console.log('   age3@geslab.com → AGE → mod2      | dept2');
    console.log('   age4@geslab.com → AGE → mod2      | dept2');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 Solicitudes:');
    console.log('   SOL-A1 → age1 | Pendiente  | revisor: mod1');
    console.log('   SOL-A2 → age2 | EnRevision | revisor: mod1');
    console.log('   SOL-B1 → mod1 | Pendiente  | sin revisor');
    console.log('   SOL-C1 → adm1 | Pendiente  | sin revisor');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 Plantillas de turno (creador: adm1):');
    console.log('   Turno Mañana  | 06:00 → 14:00 | activa: true');
    console.log('   Turno Tarde   | 14:00 → 22:00 | activa: true');
    console.log('   Turno Diurno  | 08:00 → 16:00 | activa: true');
    console.log('   Turno Mixto   | 10:00 → 18:00 | activa: true');
    console.log('   Turno Legado  | 07:00 → 12:00 | activa: false');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
main()
    .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map