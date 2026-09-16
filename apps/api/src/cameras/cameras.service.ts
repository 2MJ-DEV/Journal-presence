import { Injectable } from '@nestjs/common';
import { CameraStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CamerasService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.camera.findMany({ orderBy: { name: 'asc' } }); }
  create(data: { name: string; location?: string }) { return this.prisma.camera.create({ data }); }
  update(id: string, data: { name?: string; location?: string; status?: CameraStatus }) { return this.prisma.camera.update({ where: { id }, data }); }
}
