import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';

@Injectable()
export class GetHomeworkAssignments {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    homeworkId,
    teacherId,
  }: {
    teacherId: string;
    homeworkId: string;
  }) {
    const homework = await this.prisma.homeWork.findFirst({
      where: { id: homeworkId, course: { teacherId } },
    });
    if (!homework) {
      throw new CourseNotOwns({
        action: 'getHomeWorkAssignments',
        teacherId,
        homeworkId,
      });
    }

    const assignments = await this.prisma.homeWorkAsignment.findMany({
      where: { homeWorkId: homework.id },
      include: { files: true, student: true },
    });

    const users = await this.prisma.user.findMany({
      where: { id: { in: assignments.map((a) => a.student.userId) } },
    });

    return {
      ...homework,
      assignments: assignments.map((a) => ({
        ...a,
        user: users.find((u) => u.id === a.student.userId),
      })),
    };
  }
}
