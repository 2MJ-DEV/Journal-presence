import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { StudentsService } from './students.service';

class CreateStudentDto {
  @IsString() @MinLength(2) studentNumber!: string;
  @IsString() @MinLength(1) firstName!: string;
  @IsString() @MinLength(1) lastName!: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() promotion?: string;
  @IsOptional() @IsString() photoUrl?: string;
}

class UpdateStudentDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() promotion?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

@Controller('students')
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get() list() { return this.students.list(); }
  @Get(':id') find(@Param('id') id: string) { return this.students.findById(id); }
  @Post() create(@Body() dto: CreateStudentDto) { return this.students.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateStudentDto) { return this.students.update(id, dto); }
}
