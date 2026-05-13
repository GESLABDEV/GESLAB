// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter }); // ← Prisma v7: la conexión va por el adapter
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma conectado a PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}