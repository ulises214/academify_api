import { Injectable } from '@nestjs/common';
import { File, UserRole } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { FileNotFound } from '../domain/file-not-found';
import { FileStorageService } from '../infrastructure/file.storage';

@Injectable()
export class DownloadAppFile {
  private error!: FileNotFound;
  constructor(
    private readonly prisma: PrismaService,
    private readonly _storageService: FileStorageService,
  ) {}

  async downloadFile(fileId: string, role: UserRole, teacherStudentId: string) {
    this.error = new FileNotFound({
      fileId,
      requiredByRole: role,
      requiredById: teacherStudentId,
    });
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });
    if (!file) {
      throw this.error;
    }

    if (role === 'STUDENT') {
      await this.verifyStudent(file, teacherStudentId);
    }

    if (role === 'TEACHER') {
      await this.verifyTeacher(file, teacherStudentId);
    }

    const fileData = await this._storageService.downloadFile(fileId);

    if (!fileData) {
      throw this.error;
    }

    return {
      ...file,
      data: Buffer.from(fileData).toString('base64'),
    };
  }

  private async verifyTeacher(file: File, teacherId: string) {
    let homeWorkId = file.homeWorkId ?? undefined;
    if (file.homeWorkAsignmentId) {
      const assignment = await this.prisma.homeWorkAsignment.findUnique({
        where: { id: file.homeWorkAsignmentId },
      });

      if (!assignment) {
        throw this.error;
      }
      homeWorkId = assignment.homeWorkId;
    }

    const homework = await this.prisma.homeWork.findFirst({
      where: { id: homeWorkId, course: { teacherId } },
    });

    if (!homework) {
      throw this.error;
    }
  }

  private async verifyStudent(file: File, studentId: string) {
    const assignment = await this.prisma.homeWorkAsignment.findFirst({
      where: {
        studentId,
        id: file.homeWorkAsignmentId ?? undefined,
        homeWorkId: file.homeWorkId ?? undefined,
      },
    });

    if (assignment?.studentId !== studentId) {
      throw this.error;
    }
  }
}
