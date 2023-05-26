import {
  DomainException,
  ExceptionLog,
} from '../../common/exceptions/domain.exception';

export class HomeworkNotAssigned extends DomainException {
  override type = 'HomeworkNotAssigned';

  constructor(
    private readonly data: {
      homeworkId: string;
      studentId: string;
    },
    stack?: string,
  ) {
    super(`Homework not assigned`, { stack });
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
        message: `Homework ${homeworkId} not assigned to student ${studentId}`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
