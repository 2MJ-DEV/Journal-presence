import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService as Database } from '../prisma.service';

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: Database) {}

  async record(input: { eventId?: string; studentId: string; type: MovementType; timestamp?: Date; confidence?: number; cameraId?: string; source?: 'SIMULATED' | 'VISION' | 'IMPORTED' }) {
    const timestamp = input.timestamp ?? new Date();
    return this.prisma.$transaction(async (tx) => {
      if (input.eventId) {
        const existing = await tx.labMovement.findUnique({ where: { eventId: input.eventId } });
        if (existing) return existing;
      }
      const student = await tx.student.findUnique({ where: { id: input.studentId } });
      if (!student) throw new NotFoundException('Étudiant introuvable');
      if (!student.active) throw new BadRequestException('Étudiant désactivé');

      const last = await tx.labMovement.findFirst({ where: { studentId: input.studentId }, orderBy: [{ timestamp: 'desc' }, { createdAt: 'desc' }] });
      if (last?.type === input.type) throw new BadRequestException(`Mouvement ${input.type} dupliqué`);

      const movement = await tx.labMovement.create({ data: { ...input, timestamp, source: input.source ?? 'SIMULATED' } });
      if (input.type === MovementType.ENTRY) {
        await tx.labSession.create({ data: { studentId: input.studentId, entryAt: timestamp, status: 'OPEN' } });
      } else {
        const session = await tx.labSession.findFirst({ where: { studentId: input.studentId, status: 'OPEN' }, orderBy: { entryAt: 'desc' } });
        if (session) {
          const duration = Math.max(0, timestamp.getTime() - session.entryAt.getTime());
          await tx.labSession.update({ where: { id: session.id }, data: { exitAt: timestamp, duration, status: 'CLOSED' } });
        }
      }
      return movement;
    });
  }

  list() {
    return this.prisma.labMovement.findMany({ include: { student: true, camera: true }, orderBy: { timestamp: 'desc' }, take: 100 });
  }

  byStudent(studentId: string) {
    return this.prisma.labMovement.findMany({ where: { studentId }, orderBy: { timestamp: 'asc' } });
  }
}
