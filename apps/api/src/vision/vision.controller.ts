import { Body, Controller, Post } from '@nestjs/common';
import { IsDateString, IsEnum, IsIn, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { MovementType } from '@prisma/client';
import { VisionService } from './vision.service';

class VisionEventDto {
  @IsUUID() eventId!: string;
  @IsUUID() studentId!: string;
  @IsEnum(MovementType) type!: MovementType;
  @IsDateString() timestamp!: string;
  @IsNumber() @Min(0) @Max(1) confidence!: number;
  @IsUUID() cameraId!: string;
  @IsOptional() @IsIn(['SIMULATED', 'VISION', 'IMPORTED']) source?: 'SIMULATED' | 'VISION' | 'IMPORTED';
}

@Controller('vision')
export class VisionController {
  constructor(private readonly vision: VisionService) {}

  @Post('events')
  receive(@Body() dto: VisionEventDto) {
    return this.vision.receive({ ...dto, timestamp: new Date(dto.timestamp) });
  }

  @Post('events/batch')
  receiveBatch(@Body() dtos: VisionEventDto[]) {
    return this.vision.receiveBatch(dtos.map((dto) => ({ ...dto, timestamp: new Date(dto.timestamp) })));
  }
}
