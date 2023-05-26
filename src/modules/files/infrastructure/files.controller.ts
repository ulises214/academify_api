import { Controller, Get, Param, Session, UseGuards } from '@nestjs/common';

import { LoggedSession } from '../../auth/domain/session-user';
import { SessionGuard } from '../../auth/guards/session.guard';
import { Roles } from '../../users/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../users/infrastructure/guards/role.guard';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly _filesService: FilesService) {}

  @Roles('STUDENT', 'TEACHER')
  @UseGuards(SessionGuard, RolesGuard)
  @Get(':fileId')
  async downloadFile(
    @Session() session: LoggedSession,
    @Param('fileId') fileId: string,
  ) {
    const {
      user: {
        attributes: { role, studentId, teacherId },
      },
    } = session;

    if (!studentId && !teacherId) {
      throw new Error('User not found');
    }

    return await this._filesService.downloadFile(
      fileId,
      role,
      studentId ?? teacherId ?? '',
    );
  }
}
