import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class GetCoursesStatisticsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async count() {
    const courses = await this.prisma.course.count();

    return courses;
  }
}
