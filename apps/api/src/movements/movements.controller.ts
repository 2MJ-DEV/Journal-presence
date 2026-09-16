import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsDateString, IsEnum, IsIn, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { MovementType } from '@prisma/client';
import { MovementsService } from './movements.service';

class CreateMovementDto {
  @IsOptional() @IsUUID() eventId?: string;
  @IsUUID() studentId!: string;
  @IsEnum(MovementType) type!: MovementType;
  @IsOptional() @IsDateString() timestamp?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(1) confidence?: number;
  @IsOptional() @IsUUID() cameraId?: string;
  @IsOptional() @IsIn(['SIMULATED', 'VISION', 'IMPORTED']) source?: 'SIMULATED' | 'VISION' | 'IMPORTED';
}

@Controller('movements')
export class MovementsController {
  constructor(private readonly movements: MovementsService) {}
  @Get() list() { return this.movements.list(); }
  @Get('student/:studentId') byStudent(@Param('studentId') studentId: string) { return this.movements.byStudent(studentId); }
  @Post() record(@Body() dto: CreateMovementDto) { return this.movements.record({ ...dto, timestamp: dto.timestamp ? new Date(dto.timestamp) : undefined }); }
}
