import { Body, Controller, Get, Patch, Post, Param } from '@nestjs/common';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CameraStatus } from '@prisma/client';
import { CamerasService } from './cameras.service';

class CameraDto { @IsString() @MinLength(2) name!: string; @IsOptional() @IsString() location?: string; }
class CameraUpdateDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsString() location?: string; @IsOptional() @IsEnum(CameraStatus) status?: CameraStatus; }

@Controller('cameras')
export class CamerasController {
  constructor(private readonly cameras: CamerasService) {}
  @Get() list() { return this.cameras.list(); }
  @Post() create(@Body() dto: CameraDto) { return this.cameras.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: CameraUpdateDto) { return this.cameras.update(id, dto); }
}
