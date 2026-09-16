import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.student.findMany({ orderBy: [{ active: 'desc' }, { lastName: 'asc' }] });
  }

  async findById(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Étudiant introuvable');
    return student;
  }

  create(data: { studentNumber: string; firstName: string; lastName: string; department?: string; promotion?: string; photoUrl?: string }) {
    return this.prisma.student.create({ data });
  }

  async update(id: string, data: Partial<{ firstName: string; lastName: string; department: string; promotion: string; photoUrl: string; active: boolean }>) {
    await this.findById(id);
    return this.prisma.student.update({ where: { id }, data });
  }
}
