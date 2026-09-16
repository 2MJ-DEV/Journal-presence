import { Controller, Get, Param } from '@nestjs/common';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presence: PresenceService) {}
  @Get('current') current() { return this.presence.current(); }
  @Get('student/:studentId') student(@Param('studentId') studentId: string) { return this.presence.student(studentId); }
}
