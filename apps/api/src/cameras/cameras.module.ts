import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';

@Module({ controllers: [CamerasController], providers: [CamerasService, PrismaService] })
export class CamerasModule {}
