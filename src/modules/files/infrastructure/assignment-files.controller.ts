import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Session,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { LoggedSession } from '../../auth/domain/session-user';
import { SessionGuard } from '../../auth/guards/session.guard';
import { Roles } from '../../users/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../users/infrastructure/guards/role.guard';
import { AssignmentFilesService } from './assignment-files.service';

@Controller('files/assignments')
export class AssignmentFilesController {
  constructor(private readonly service: AssignmentFilesService) {}

  @Roles('STUDENT')
  @UseGuards(SessionGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':homeworkId/file')
  async uploadFile(
    @Param('homeworkId') homeWorkId: string,
    @Session() session: LoggedSession,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const studentId = session.user.attributes.studentId;

    if (!file) {
      throw new BadRequestException();
    }

    if (!studentId) {
      throw new UnauthorizedException();
    }

    return this.service.saveAssignmentFile(file, homeWorkId, studentId);

    return true;
  }
}
