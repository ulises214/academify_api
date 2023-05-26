import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';

@Injectable()
export class DeleteCourse {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    courseId,
    teacherId,
  }: {
    courseId: string;
    teacherId: string;
  }) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course || course.teacherId !== teacherId) {
      throw new CourseNotOwns({
        action: 'deleteCourse',
        teacherId,
        courseId,
      });
    }

    return await this.prisma.course.delete({
      where: { id: courseId },
    });
  }
}
