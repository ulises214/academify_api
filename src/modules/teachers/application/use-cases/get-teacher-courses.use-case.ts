import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class GetTeacherCourses {
  constructor(private readonly prisma: PrismaService) {}

  async execute(teacherId: string) {
    return await this.prisma.course.findMany({
      where: {
        teacherId,
      },
    });
  }
}
