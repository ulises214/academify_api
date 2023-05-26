import { Injectable } from '@nestjs/common';

import { UploadAssignmentFile } from '../assignment/application/use-cases/upload-assignment-file.use-case';

@Injectable()
export class AssignmentFilesService {
  constructor(private readonly _saveAssignmentFile: UploadAssignmentFile) {}

  async saveAssignmentFile(
    buff: Express.Multer.File,
    homeworkId: string,
    studentId: string,
  ) {
    return this._saveAssignmentFile.execute({
      buff,
      homeworkId,
      studentId,
    });
  }
}
