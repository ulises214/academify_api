import {
  DomainException,
  ExceptionLog,
} from '../../common/exceptions/domain.exception';

export class AssignmentAlreadyDelivered extends DomainException {
  override type = 'AssignmentAlreadyDelivered';

  constructor(
    private readonly data: {
      homeworkId: string;
      studentId: string;
    },
    stack?: string,
  ) {
    super(`Assignment already delivered`, { stack });
  }

  override toLog(): ExceptionLog {
    const { homeworkId, studentId } = this.data;

    return {
      error: this.message,
      request: {
        homeworkId,
        studentId,
      },
      response: {
        message: `Assignment ${homeworkId} already delivered by student ${studentId}`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
