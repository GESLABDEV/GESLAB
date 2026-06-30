import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  imports:     [PrismaModule],
  controllers: [SchedulesController],
  providers:   [SchedulesService],
  exports:     [SchedulesService], // Disponible para EngineModule en T-04
})
export class SchedulesModule {}