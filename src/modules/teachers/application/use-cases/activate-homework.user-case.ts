import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';

@Injectable()
export class ActivateHomeWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute(homeworkId: string, teacherId: string) {
    const homework = await this.prisma.homeWork.findUnique({
      where: {
        id: homeworkId,
      },
      include: {
        course: true,
      },
    });

    if (homework?.course.teacherId !== teacherId) {
      throw new CourseNotOwns({
        courseId: homework?.courseId,
        teacherId,
        action: 'activateHomeWork',
      });
    }

    const subscribedStudents = await this.prisma.courseSubscription.findMany({
      where: { courseId: homework.courseId },
    });

    await this.prisma.$transaction(async (prisma) => {
      await prisma.homeWork.update({
        where: { id: homeworkId },
        data: { status: 'ACTIVE' },
      });
      await prisma.homeWorkAsignment.createMany({
        data: subscribedStudents.map((student) => ({
          homeWorkId: homeworkId,
          studentId: student.studentId,
        })),
      });
    });
  }
}
