import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { AssignmentAlreadyDelivered } from '../../../files/domain/assignment-alreate-delivered';
import { HomeworkNotAssigned } from '../../../files/domain/homework-not-assigned';

@Injectable()
export class DeliverHomeWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    studentId,
    homeWorkId,
  }: {
    studentId: string;
    homeWorkId: string;
  }) {
    const assignment = await this.prisma.homeWorkAsignment.findUnique({
      where: {
        homeWorkId_studentId: {
          homeWorkId,
          studentId,
        },
      },
      include: {
        homeWork: true,
      },
    });

    if (!assignment) {
      throw new HomeworkNotAssigned({
        homeworkId: homeWorkId,
        studentId,
      });
    }

    if (assignment.status !== 'UNDELIVERED') {
      throw new AssignmentAlreadyDelivered({
        homeworkId: homeWorkId,
        studentId,
      });
    }

    const active = assignment.homeWork.status !== 'CLOSED';

    if (!active) {
      throw new HomeworkNotAssigned({
        homeworkId: homeWorkId,
        studentId,
      });
    }

    const onTime = new Date() <= new Date(assignment.homeWork.closeAt);

    await this.prisma.homeWorkAsignment.update({
      where: {
        homeWorkId_studentId: {
          homeWorkId,
          studentId,
        },
      },
      data: {
        status: onTime ? 'DELIVERED' : 'DELIVERED_LATE',
        deliverAt: new Date().toISOString(),
      },
    });
  }
}
