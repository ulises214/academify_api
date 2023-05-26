import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';

import { LoggedSession } from '../../auth/domain/session-user';
import { SessionGuard } from '../../auth/guards/session.guard';
import { Roles } from '../../users/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../users/infrastructure/guards/role.guard';
import { CreateCourseDTO } from '../application/dto/create-course.dto';
import { TeachersService } from './teacher.service';

@Controller('teachers/courses')
export class TeachersCoursesController {
  constructor(private readonly teachersService: TeachersService) {}

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Post()
  async createCourse(
    @Session() session: LoggedSession,
    @Body() body: CreateCourseDTO,
  ) {
    const { teacherId } = session.user.attributes;

    if (!teacherId) {
      throw new Error('Teacher not found');
    }

    const scapedData = CreateCourseDTO.scape(body);

    return await this.teachersService.createCourse(scapedData, teacherId);
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Get()
  async getCourses(@Session() session: LoggedSession) {
    const { teacherId } = session.user.attributes;

    if (!teacherId) {
      throw new Error('Teacher not found');
    }

    return await this.teachersService.getCourses(teacherId);
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Put(':courseId')
  async updateCourse(
    @Session() session: LoggedSession,
    @Body() body: CreateCourseDTO,
    @Param('courseId') courseId: string,
  ) {
    const { teacherId } = session.user.attributes;

    if (!teacherId) {
      throw new Error('Teacher not found');
    }
    const scapedData = CreateCourseDTO.scape(body);

    return await this.teachersService.updateCourse(
      courseId,
      scapedData,
      teacherId,
    );
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Delete(':courseId')
  async deleteCourse(
    @Session() session: LoggedSession,
    @Param('courseId') courseId: string,
  ) {
    const { teacherId } = session.user.attributes;

    if (!teacherId) {
      throw new Error('Teacher not found');
    }

    return await this.teachersService.deleteCourse(courseId, teacherId);
  }
}
