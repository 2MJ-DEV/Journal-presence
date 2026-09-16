import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';

@Module({
  controllers: [MovementsController],
  providers: [MovementsService, PrismaService],
  exports: [MovementsService],
})
export class MovementsModule {}
