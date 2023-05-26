import { Injectable } from '@nestjs/common';

import { UploadHomeWorkFile } from '../homeworks/application/use-cases/upload-homework-file.use-case';

@Injectable()
export class HomeWorksFilesService {
  constructor(private readonly _uploadHomeWorkFile: UploadHomeWorkFile) {}

  async uploadHomeWorkFile(
    buffer: Express.Multer.File,
    {
      courseId,
      homeWorkId,
      teacherId,
    }: {
      courseId: string;
      homeWorkId: string;
      teacherId: string;
    },
  ) {
    return this._uploadHomeWorkFile.execute({
      buff: buffer,
      courseId,
      homeworkId: homeWorkId,
      teacherId,
    });
  }
}
