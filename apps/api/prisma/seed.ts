import dotenv from 'dotenv';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  const students = [
    { studentNumber: 'STD-001', firstName: 'Jules', lastName: 'Mukadi', department: 'Informatique', promotion: 'L3' },
    { studentNumber: 'STD-002', firstName: 'Amina', lastName: 'Kalume', department: 'Génie logiciel', promotion: 'L2' },
    { studentNumber: 'STD-003', firstName: 'Noah', lastName: 'Ilunga', department: 'Réseaux', promotion: 'L3' },
  ];
  for (const student of students) await prisma.student.upsert({ where: { studentNumber: student.studentNumber }, update: student, create: student });
  await prisma.camera.upsert({ where: { id: '00000000-0000-0000-0000-000000000001' }, update: { status: 'ONLINE' }, create: { id: '00000000-0000-0000-0000-000000000001', name: 'Entrée principale', location: 'Laboratoire 1', status: 'ONLINE', lastSeenAt: new Date() } });
}

main().finally(() => prisma.$disconnect());
