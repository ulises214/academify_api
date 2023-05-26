import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';

@Injectable()
export class GetCourseHomeWorks {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    courseId,
    teacherId,
  }: {
    courseId: string;
    teacherId: string;
  }) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course || course.teacherId !== teacherId) {
      throw new CourseNotOwns({
        action: 'getCourseHomeWorks',
        teacherId,
        courseId,
      });
    }

    const homeWorks = await this.prisma.homeWork.findMany({
      where: { courseId },
    });

    return {
      ...course,
      homeWorks,
    };
  }
}
