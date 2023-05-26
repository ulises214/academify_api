import { Injectable } from '@nestjs/common';
import cryto from 'crypto';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateCourseDTO } from '../dto/create-course.dto';

@Injectable()
export class CreateCourse {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    data: CreateCourseDTO,
    {
      teacherId,
    }: {
      teacherId: string;
    },
  ) {
    // code with 6 digits
    const code = cryto.randomBytes(3).toString('hex').toUpperCase();
    const { description, name, status } = data;
    const course = await this.prisma.course.create({
      data: {
        description,
        name,
        code,
        status,
        teacherId,
      },
    });

    return course;
  }
}
