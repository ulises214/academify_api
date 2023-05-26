import {
  Body,
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
import { CreateHomeworkDto } from '../application/dto/create-homework';
import { RateAssignmentDTO } from '../application/dto/rate-assignment.dto';
import { TeachersService } from './teacher.service';

@Controller('teachers/homeworks')
export class TeacherHomeworksController {
  constructor(private readonly teacherService: TeachersService) {}

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Post()
  async createHomework(
    @Body() data: CreateHomeworkDto,
    @Session() session: LoggedSession,
  ) {
    const id = this._getTeacherId(session);

    const parsedData = CreateHomeworkDto.scape(data);

    return await this.teacherService.createHomework(parsedData, id);
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Post(':homeworkId/activate')
  async activateHomeWork(
    @Session() session: LoggedSession,
    @Param('homeworkId') homeworkId: string,
  ) {
    const id = this._getTeacherId(session);

    await this.teacherService.activateHomework(homeworkId, id);

    return true;
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Get('course/:courseId')
  async getCourseHomeworks(
    @Session() session: LoggedSession,
    @Param('courseId') courseId: string,
  ) {
    const id = this._getTeacherId(session);

    return await this.teacherService.getCourseHomeworks(courseId, id);
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Get(':homeworkId')
  async getHomeworkDetails(
    @Session() session: LoggedSession,
    @Param('homeworkId') homeworkId: string,
  ) {
    const id = this._getTeacherId(session);

    return await this.teacherService.getHomeworkDetails(homeworkId, id);
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Post('rate/:assignmentId')
  async rateHomework(
    @Session() session: LoggedSession,
    @Param('assignmentId') assignmentId: string,
    @Body() data: RateAssignmentDTO,
  ) {
    const id = this._getTeacherId(session);

    return await this.teacherService.rateAssignment(
      id,
      assignmentId,
      data.rate,
    );
  }

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Get(':homeworkId/assignments')
  async getHomeworkAssignments(
    @Session() session: LoggedSession,
    @Param('homeworkId') homeworkId: string,
  ) {
    const id = this._getTeacherId(session);

    return await this.teacherService.getHomeworkAssignments(homeworkId, id);
  }

  private _getTeacherId(session: LoggedSession) {
    const id = session.user.attributes.teacherId;

    if (!id) {
      throw new UnauthorizedException();
    }

    return id;
  }
}
