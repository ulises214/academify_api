import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma/prisma.service';
import { AssignmentAlreadyDelivered } from '../../../domain/assignment-alreate-delivered';
import { FileNotUploaded } from '../../../domain/file-not-uploaded';
import { HomeworkNotAssigned } from '../../../domain/homework-not-assigned';
import { FileStorageService } from '../../../infrastructure/file.storage';

@Injectable()
export class UploadAssignmentFile {
  constructor(
    private readonly storage: FileStorageService,
    private readonly prisma: PrismaService,
  ) {}

  async execute({
    buff,
    homeworkId,
    studentId,
  }: {
    buff: Express.Multer.File;
    homeworkId: string;
    studentId: string;
  }) {
    const assignment = await this.prisma.homeWorkAsignment.findUnique({
      where: {
        homeWorkId_studentId: {
          homeWorkId: homeworkId,
          studentId,
        },
      },
      include: {
        homeWork: true,
      },
    });

    if (!assignment) {
      throw new HomeworkNotAssigned({
        homeworkId,
        studentId,
      });
    }

    if (assignment.status !== 'UNDELIVERED') {
      throw new AssignmentAlreadyDelivered({
        homeworkId,
        studentId,
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
          homeWorkAsignmentId: assignment.id,
        },
      });
      const [_, uploaded] = await this.storage.saveFile(buff.buffer, file.id);

      if (!uploaded) {
        throw new FileNotUploaded({
          file: buff,
          type: 'assignment',
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
