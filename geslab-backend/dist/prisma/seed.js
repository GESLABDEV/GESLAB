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
    console.log('Iniciando seed...');
    const h = (p) => bcrypt.hash(p, 12);
    const sa = await prisma.usuario.upsert({
        where: { email: 'admin@geslab.com' },
        update: { contrasena_hash: await h('Admin1234') },
        create: {
            nombre: 'Super Admin',
            email: 'admin@geslab.com',
            contrasena_hash: await h('Admin1234'),
            rol: client_1.Rol.SA,
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
                rol: client_1.Rol.AGE,
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
//# sourceMappingURL=seed.js.map