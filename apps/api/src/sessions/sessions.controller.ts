import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}
  @Get() list() { return this.sessions.list(); }
  @Get('student/:studentId') byStudent(@Param('studentId') studentId: string) { return this.sessions.byStudent(studentId); }
}
