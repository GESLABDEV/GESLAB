import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EngineController } from './engine.controller';
import { EngineService } from './engine.service';

@Module({
  imports:     [PrismaModule],
  controllers: [EngineController],
  providers:   [EngineService],
  exports:     [EngineService], // Disponible para ComplianceModule en T-05
})
export class EngineModule {}