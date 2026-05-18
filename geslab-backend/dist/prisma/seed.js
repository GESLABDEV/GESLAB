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
    console.log('🌱 Iniciando seed de GESLAB...\n');
    const saltRounds = 10;
    console.log('👤 Sembrando usuarios...');
    const sa = await prisma.usuario.upsert({
        where: { email: 'admin@geslab.com' },
        update: {},
        create: {
            nombre: 'Super Admin',
            email: 'admin@geslab.com',
            contrasena_hash: await bcrypt.hash('Admin1234', saltRounds),
            rol: client_1.Rol.SA,
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
            rol: client_1.Rol.ADM,
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
            rol: client_1.Rol.ADM,
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
            rol: client_1.Rol.MOD,
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
            rol: client_1.Rol.MOD,
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
            rol: client_1.Rol.AGE,
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
            rol: client_1.Rol.AGE,
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
            rol: client_1.Rol.AGE,
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
            rol: client_1.Rol.AGE,
            activo: true,
            id_moderador: mod2.id_usuario,
        },
    });
    console.log(`   ✅ SA: ${sa.email}`);
    console.log(`   ✅ ADMs: ${adm1.email}, ${adm2.email}`);
    console.log(`   ✅ MODs: ${mod1.email}, ${mod2.email}`);
    console.log(`   ✅ AGEs: ${age1.email}, ${age2.email}, ${age3.email}, ${age4.email}`);
    console.log('\n🏢 Sembrando departamentos...');
    const dept1 = await (async () => {
        const existente = await prisma.departamento.findFirst({
            where: { nombre: 'Atención al Cliente' },
        });
        if (existente)
            return existente;
        return prisma.departamento.create({
            data: { nombre: 'Atención al Cliente' },
        });
    })();
    const dept2 = await (async () => {
        const existente = await prisma.departamento.findFirst({
            where: { nombre: 'Soporte Técnico' },
        });
        if (existente)
            return existente;
        return prisma.departamento.create({
            data: { nombre: 'Soporte Técnico' },
        });
    })();
    console.log(`   ✅ ${dept1.nombre} (id: ${dept1.id_departamento})`);
    console.log(`   ✅ ${dept2.nombre} (id: ${dept2.id_departamento})`);
    console.log('\n📬 Sembrando novedades de prueba...');
    const novedadesSeed = [
        {
            tipo: client_1.TipoNovedad.Vacaciones,
            estado: client_1.EstadoNovedad.Registrada,
            fecha_inicio: new Date('2026-06-01'),
            fecha_fin: new Date('2026-06-15'),
            descripcion: 'Vacaciones aprobadas período junio 2026',
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
            descripcion: 'Permiso por diligencia personal — cita médica familiar',
            soporte_url: null,
            id_usuario: age3.id_usuario,
            id_registrado_por: adm2.id_usuario,
        },
        {
            tipo: client_1.TipoNovedad.Ausencia,
            estado: client_1.EstadoNovedad.Registrada,
            fecha_inicio: new Date('2026-06-05'),
            fecha_fin: new Date('2026-06-05'),
            descripcion: 'Ausencia justificada — trámite personal',
            soporte_url: null,
            id_usuario: age4.id_usuario,
            id_registrado_por: adm2.id_usuario,
        },
    ];
    for (const novedad of novedadesSeed) {
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
        }
        else {
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
//# sourceMappingURL=seed.js.map