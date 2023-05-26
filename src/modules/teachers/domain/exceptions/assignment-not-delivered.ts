import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class AssignmentNotDelivered extends DomainException {
  override type = 'AssignmentNotDelivered';
  constructor(
    private readonly data: {
      assignmentId: string;
      teacherId: string;
    },
    stack?: string,
  ) {
    super('Assignment not delivered', { stack });
  }

  override toLog(): ExceptionLog {
    const { assignmentId, teacherId } = this.data;

    return {
      error: this.message,
      request: {
        assignmentId,
        teacherId,
      },
      response: {
        message: `Assignment ${assignmentId} not delivered`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
