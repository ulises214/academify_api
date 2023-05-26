import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { HomeworkNotAssigned } from '../../../files/domain/homework-not-assigned';

@Injectable()
export class GetStudentHomeWorkDetails {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    homeWorkId,
    studentId,
  }: {
    studentId: string;
    homeWorkId: string;
  }) {
    const assignment = await this.prisma.homeWorkAsignment.findUnique({
      where: { homeWorkId_studentId: { homeWorkId, studentId } },
      include: {
        files: true,
      },
    });
    if (!assignment) {
      throw new HomeworkNotAssigned({ homeworkId: homeWorkId, studentId });
    }
    const homework = await this.prisma.homeWork.findUnique({
      where: { id: homeWorkId },
      include: {
        files: true,
      },
    });

    if (!homework) {
      throw new HomeworkNotAssigned({ homeworkId: homeWorkId, studentId });
    }

    return {
      ...homework,
      asignment: assignment,
    };
  }
}
