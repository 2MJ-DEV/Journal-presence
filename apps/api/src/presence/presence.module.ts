import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({ controllers: [PresenceController], providers: [PresenceService, PrismaService] })
export class PresenceModule {}
