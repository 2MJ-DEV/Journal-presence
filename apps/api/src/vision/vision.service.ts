import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { MovementsService } from '../movements/movements.service';
import { PrismaService as Database } from '../prisma.service';

export type VisionEventInput = {
  eventId: string;
  studentId: string;
  type: MovementType;
  timestamp: Date;
  confidence: number;
  cameraId: string;
  source?: 'SIMULATED' | 'VISION' | 'IMPORTED';
};

@Injectable()
export class VisionService {
  constructor(
    private readonly prisma: Database,
    private readonly movements: MovementsService,
  ) {}

  async receive(event: VisionEventInput) {
    if (event.confidence < 0 || event.confidence > 1) {
      throw new BadRequestException('La confiance doit être comprise entre 0 et 1');
    }
    const existing = await this.prisma.labMovement.findUnique({ where: { eventId: event.eventId } });
    if (existing) return { accepted: true, duplicate: true, movement: existing };

    const [student, camera] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: event.studentId } }),
      this.prisma.camera.findUnique({ where: { id: event.cameraId } }),
    ]);
    if (!student) throw new NotFoundException('Étudiant introuvable');
    if (!camera) throw new NotFoundException('Caméra introuvable');

    const movement = await this.movements.record({ ...event, source: 'VISION' });
    await this.prisma.camera.update({
      where: { id: event.cameraId },
      data: { status: 'ONLINE', lastSeenAt: new Date() },
    });
    return { accepted: true, duplicate: false, movement };
  }

  async receiveBatch(events: VisionEventInput[]) {
    const results = [];
    for (const event of events) results.push(await this.receive(event));
    return { accepted: results.length, results };
  }
}
