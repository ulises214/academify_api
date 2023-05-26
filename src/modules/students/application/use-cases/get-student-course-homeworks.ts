import { Injectable } from '@nestjs/common';
import { HomeWork, HomeWorkAsignment } from '@prisma/client';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { StudentNotSubscribedToCourse } from '../../domain/exceptions/student-not-subscribed';

@Injectable()
export class GetStudentCourseHomeWorks {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    courseId,
    studentId,
  }: {
    studentId: string;
    courseId: string;
  }): Promise<
    (HomeWork & {
      asignment: HomeWorkAsignment;
    })[]
  > {
    const course = await this.prisma.courseSubscription.findUnique({
      where: {
        studentId_courseId: {
          courseId,
          studentId,
        },
      },
    });

    if (!course) {
      throw new StudentNotSubscribedToCourse({
        courseId,
        studentId,
      });
    }

    const assignments = await this.prisma.homeWorkAsignment.findMany({
      where: {
        studentId,
        homeWork: {
          courseId,
        },
      },
      include: {
        homeWork: true,
      },
    });

    return assignments.map((assignment) => {
      const { homeWork, ...rest } = assignment;

      return {
        ...homeWork,
        asignment: rest,
      };
    });
  }
}
