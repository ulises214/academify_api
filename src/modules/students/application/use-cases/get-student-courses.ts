import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class GetStudentCourses {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(studentId: string) {
    const courses = await this.prismaService.course.findMany({
      where: {
        subscriptions: {
          some: {
            studentId,
          },
        },
      },
    });

    const uniqueTeachers = new Set(courses.map((course) => course.teacherId));

    const teachers = await this.prismaService.teacher.findMany({
      where: {
        id: {
          in: Array.from(uniqueTeachers),
        },
      },
      include: {
        user: true,
      },
    });

    const coursesWithTeacher = courses.map((course) => {
      const teacher = teachers.find(
        (teacher) => teacher.id === course.teacherId,
      );

      return {
        ...course,
        teacher: teacher?.user,
      };
    });

    return coursesWithTeacher;
  }
}
