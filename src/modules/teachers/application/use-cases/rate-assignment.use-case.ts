import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { AssignmentNotDelivered } from '../../domain/exceptions/assignment-not-delivered';
import { CourseNotOwns } from '../../domain/exceptions/course-not-owns';

@Injectable()
export class RateAssignment {
  constructor(private readonly prisma: PrismaService) {}
  async execute(teacherId: string, assignmentId: string, rate: number) {
    const assignment = await this.prisma.homeWorkAsignment.findUnique({
      where: {
        id: assignmentId,
      },
    });
    if (!assignment) {
      throw new CourseNotOwns({
        teacherId,
        action: 'rateAssignment',
        assignmentId,
      });
    }
    if (!['DELIVERED', 'DELIVERED_LATE'].includes(assignment.status)) {
      throw new AssignmentNotDelivered({
        assignmentId,
        teacherId,
      });
    }
    const updatedAssignment = await this.prisma.homeWorkAsignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        status: 'EVALUATED',
        rating: rate,
      },
    });

    return updatedAssignment;
  }
}
