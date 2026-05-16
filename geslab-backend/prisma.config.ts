// prisma.config.ts
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
      migrations: {
      seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
        datasource: {
      url: 'postgresql://geslab_user:geslab_secret_dev@localhost:5432/geslab_dev?schema=public',
    },

});