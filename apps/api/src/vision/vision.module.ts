import { Module } from '@nestjs/common';
import { MovementsModule } from '../movements/movements.module';
import { PrismaService } from '../prisma.service';
import { VisionController } from './vision.controller';
import { VisionService } from './vision.service';

@Module({
  imports: [MovementsModule],
  controllers: [VisionController],
  providers: [VisionService, PrismaService],
})
export class VisionModule {}
