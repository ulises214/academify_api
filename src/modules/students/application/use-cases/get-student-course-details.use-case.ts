import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { StudentNotSubscribedToCourse } from '../../domain/exceptions/student-not-subscribed';

@Injectable()
export class GetStudentCourseDetails {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    courseId,
    studentId,
  }: {
    studentId: string;
    courseId: string;
  }) {
    const subscription = await this.prisma.courseSubscription.findUnique({
      where: {
        studentId_courseId: {
          courseId,
          studentId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!subscription) {
      throw new StudentNotSubscribedToCourse({
        courseId,
        studentId,
      });
    }

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: subscription.course.teacherId,
      },
      include: {
        user: true,
      },
    });

    return {
      ...subscription.course,
      teacher: teacher?.user,
    };
  }
}
