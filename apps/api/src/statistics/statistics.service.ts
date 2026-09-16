import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async daily() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const movements = await this.prisma.labMovement.findMany({ where: { timestamp: { gte: start } } });
    const present = await this.prisma.student.count({ where: { active: true, movements: { some: { type: 'ENTRY', timestamp: { gte: start } } } } });
    return { uniqueStudents: new Set(movements.map((item) => item.studentId)).size, entries: movements.filter((item) => item.type === 'ENTRY').length, exits: movements.filter((item) => item.type === 'EXIT').length, present, generatedAt: new Date() };
  }
}
