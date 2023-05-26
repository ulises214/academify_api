import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';
import { CreateHomeworkDto } from '../dto/create-homework';

@Injectable()
export class CreateHomework {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    data: CreateHomeworkDto,
    {
      teacherId,
    }: {
      teacherId: string;
    },
  ) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: data.courseId,
      },
    });

    if (course?.teacherId !== teacherId) {
      throw new CourseNotOwns({
        courseId: data.courseId,
        teacherId,
        action: 'createHomework',
      });
    }

    const homework = await this.prisma.homeWork.create({
      data: {
        ...data,
        status: 'CLOSED',
        courseId: course.id,
      },
    });

    return homework;
  }
}
