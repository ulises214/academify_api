import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma/prisma.service';
import { CourseNotFound } from '../../../../students/domain/exceptions/course-not-found';
import { CourseNotOwns } from '../../../../teachers/domain/exceptions/course-not-owns';
import { FileNotUploaded } from '../../../domain/file-not-uploaded';
import { FileStorageService } from '../../../infrastructure/file.storage';

@Injectable()
export class UploadHomeWorkFile {
  constructor(
    private readonly storage: FileStorageService,
    private readonly prisma: PrismaService,
  ) {}

  async execute({
    buff,
    courseId,
    homeworkId,
    teacherId,
  }: {
    buff: Express.Multer.File;
    courseId: string;
    homeworkId: string;
    teacherId: string;
  }) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      throw new CourseNotFound({
        code: courseId,
      });
    }

    if (course.teacherId !== teacherId) {
      throw new CourseNotOwns({
        courseId,
        teacherId,
        action: 'uploadFile',
      });
    }
    let file;
    try {
      file = await this.prisma.file.create({
        data: {
          name: buff.originalname,
          path: '',
          size: buff.size,
          type: buff.mimetype,
          homeWorkId: homeworkId,
        },
      });
      const [_, uploaded] = await this.storage.saveFile(buff.buffer, file.id);

      if (!uploaded) {
        throw new FileNotUploaded({
          file: buff,
          type: 'homework',
        });
      }

      return file;
    } catch (e) {
      if (file) {
        await this.storage.deleteFile(file.id);
      }

      throw e;
    }
  }
}
