import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';

@Module({
  imports:     [PrismaModule],
  controllers: [ComplianceController],
  providers:   [ComplianceService],
  exports:     [ComplianceService], // Disponible para SchedulesModule en T-06
})
export class ComplianceModule {}