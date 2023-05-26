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
import { HomeWorksFilesService } from './homework-files.service';

@Controller('files/homeworks')
export class HomeworkFilesController {
  constructor(private readonly service: HomeWorksFilesService) {}

  @Roles('TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':courseId/:homeWorkId/file')
  async uploadFile(
    @Param('courseId') courseId: string,
    @Param('homeWorkId') homeWorkId: string,
    @Session() session: LoggedSession,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const teacherId = session.user.attributes.teacherId;

    if (!teacherId) {
      throw new UnauthorizedException();
    }

    if (!file) {
      throw new BadRequestException();
    }

    return await this.service.uploadHomeWorkFile(file, {
      courseId,
      homeWorkId,
      teacherId,
    });
  }
}
