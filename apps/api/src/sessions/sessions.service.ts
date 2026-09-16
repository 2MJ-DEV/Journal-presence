import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.labSession.findMany({ include: { student: true }, orderBy: { entryAt: 'desc' }, take: 100 }); }
  byStudent(studentId: string) { return this.prisma.labSession.findMany({ where: { studentId }, orderBy: { entryAt: 'asc' } }); }
}
