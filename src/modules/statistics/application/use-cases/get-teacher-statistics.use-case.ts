import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class GetTeacherStatisticsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async count() {
    const courses = await this.prisma.teacher.count();

    return courses;
  }
}
