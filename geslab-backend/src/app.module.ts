import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NoveltiesModule } from './novelties/novelties.module';
import { RequestsModule } from './requests/requests.module';
import { ShiftsModule } from './shifts/shifts.module';
import { ComplianceModule } from './compliance/compliance.module';
import { SurveysModule } from './surveys/surveys.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { EngineModule } from './engine/engine.module';
import { DepartmentsModule } from './departments/departments.module';
import { ShiftTemplatesModule } from './shift-templates/shift-templates.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    NoveltiesModule,
    RequestsModule,
    ShiftsModule,
    ComplianceModule,
    SurveysModule,
    NotificationsModule,
    ReportsModule,
    EngineModule,
    ShiftTemplatesModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers:   [AppService],
})
export class AppModule {}