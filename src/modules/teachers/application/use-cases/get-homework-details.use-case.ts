import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { HomeworkNotFound } from '../../domain/exceptions/homework-not-found';

@Injectable()
export class GetHomeWorkDetails {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    homeworkId,
    teacherId,
  }: {
    homeworkId: string;
    teacherId: string;
  }) {
    const homework = await this.prisma.homeWork.findFirst({
      where: { id: homeworkId, course: { teacherId } },
      include: {
        asignments: true,
        files: true,
      },
    });
    if (!homework) {
      throw new HomeworkNotFound({ homeworkId, teacherId });
    }

    return homework;
  }
}
