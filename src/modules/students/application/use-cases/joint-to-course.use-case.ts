import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotActive } from '../../domain/exceptions/course-not-active';
import { CourseNotFound } from '../../domain/exceptions/course-not-found';
import { StudentAlreadySubscribed } from '../../domain/exceptions/student-already-subscribed';

@Injectable()
export class JoinStudentToCourse {
  constructor(private readonly _prisma: PrismaService) {}

  async execute({
    studentId,
    courseCode,
  }: {
    studentId: string;
    courseCode: string;
  }) {
    const course = await this._prisma.course.findUnique({
      where: {
        code: courseCode,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!course) {
      throw new CourseNotFound({ code: courseCode, studentId });
    }

    if (course.status !== 'ACTIVE') {
      throw new CourseNotActive({ courseId: course.id, studentId });
    }

    const subscription = await this._prisma.courseSubscription.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: course.id,
        },
      },
    });

    if (subscription) {
      throw new StudentAlreadySubscribed({ courseId: course.id, studentId });
    }

    await this._prisma.courseSubscription.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        course: {
          connect: {
            code: courseCode,
          },
        },
      },
    });
  }
}
