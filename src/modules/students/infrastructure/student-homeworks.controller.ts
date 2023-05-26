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

@Controller('students/homeworks')
export class StudentsHomeworksController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @Get('course/:courseId')
  async getHomeworks(
    @Session() session: LoggedSession,
    @Param('courseId') courseId: string,
  ) {
    const studentId = this._getStudentId(session);

    return this.studentsService.getCourseHomeWorks(studentId, courseId);
  }

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @Get(':homeworkId')
  async getHomeworkDetails(
    @Session() session: LoggedSession,
    @Param('homeworkId') homeworkId: string,
  ) {
    const studentId = this._getStudentId(session);

    return this.studentsService.getHomeWork(studentId, homeworkId);
  }

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @Post(':homeworkId/deliver')
  async deliverHomework(
    @Session() session: LoggedSession,
    @Param('homeworkId') homeWorkId: string,
  ) {
    const studentId = this._getStudentId(session);

    await this.studentsService.deliverHomework(studentId, homeWorkId);

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
