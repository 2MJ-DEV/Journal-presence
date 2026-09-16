import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { StudentsModule } from './students/students.module';
import { MovementsModule } from './movements/movements.module';
import { PresenceModule } from './presence/presence.module';
import { CamerasModule } from './cameras/cameras.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SessionsModule } from './sessions/sessions.module';
import { VisionModule } from './vision/vision.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StudentsModule,
    MovementsModule,
    PresenceModule,
    CamerasModule,
    StatisticsModule,
    SessionsModule,
    VisionModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
