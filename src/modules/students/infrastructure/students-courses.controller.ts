import {
  Controller,
  Get,
  Param,
  Post,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoggedSession } from '../../auth/domain/session-user';
import { SessionGuard } from '../../auth/guards/session.guard';
import { Roles } from '../../users/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../users/infrastructure/guards/role.guard';
import { StudentsService } from './students.service';

@Controller('students/courses')
export class StudentsCoursesController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @Get()
  async getCourses(@Session() session: LoggedSession) {
    const studentId = this._getStudentId(session);

    return this.studentsService.getCourses(studentId);
  }

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @Get(':courseId')
  async getCourse(
    @Session() session: LoggedSession,
    @Param('courseId') courseId: string,
  ) {
    const studentId = this._getStudentId(session);

    return this.studentsService.getCourse(studentId, courseId);
  }

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @Post('join/:courseId')
  async joinCourse(
    @Session() session: LoggedSession,
    @Param('courseId') courseId: string,
  ) {
    const studentId = this._getStudentId(session);

    await this.studentsService.joinToCourse(studentId, courseId);

    return true;
  }

  private _getStudentId(session: LoggedSession) {
    const { studentId } = session.user.attributes;
    if (!studentId) {
      throw new UnauthorizedException();
    }

    return studentId;
  }
}
