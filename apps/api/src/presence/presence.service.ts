import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PresenceService {
  constructor(private readonly prisma: PrismaService) {}

  async current() {
    const students = await this.prisma.student.findMany({ where: { active: true }, include: { movements: { orderBy: [{ timestamp: 'desc' }, { createdAt: 'desc' }], take: 1 } } });
    return students.map(({ movements, ...student }) => ({ ...student, status: movements[0]?.type === 'ENTRY' ? 'PRESENT' : 'ABSENT', lastMovement: movements[0] ?? null }));
  }

  student(studentId: string) {
    return this.prisma.student.findUnique({ where: { id: studentId }, include: { movements: { orderBy: { timestamp: 'desc' }, take: 1 } } });
  }
}
