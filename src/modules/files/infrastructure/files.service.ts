import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { DownloadAppFile } from '../application/download-app-file.use-case';

@Injectable()
export class FilesService {
  constructor(private readonly _downloadFile: DownloadAppFile) {}

  async downloadFile(fileId: string, role: UserRole, teacherStudentId: string) {
    return this._downloadFile.downloadFile(fileId, role, teacherStudentId);
  }
}
