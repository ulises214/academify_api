import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';
import { CreateCourseDTO } from '../dto/create-course.dto';

@Injectable()
export class UpdateCourse {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    courseId,
    data,
    teacherId,
  }: {
    courseId: string;
    teacherId: string;
    data: CreateCourseDTO;
  }) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course || course.teacherId !== teacherId) {
      throw new CourseNotOwns({
        action: 'updateCourse',
        teacherId,
        courseId,
      });
    }

    return await this.prisma.course.update({
      where: { id: courseId },
      data,
    });
  }
}
