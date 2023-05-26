import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class HomeworkNotFound extends DomainException {
  override type = 'HomeworkNotFound';
  constructor(
    private readonly data: {
      homeworkId: string;
      teacherId: string;
      stack?: string;
    },
  ) {
    const { stack } = data;
    super('Homework not found', { stack });
  }

  toLog(): ExceptionLog {
    const { homeworkId, teacherId } = this.data;

    return {
      error: this.message,
      request: {
        homeworkId,
        teacherId,
      },
      response: {
        message: `Homework ${homeworkId} not found for teacher ${teacherId}`,
      },
      timestamp: new Date(),
      type: this.type,
    };
  }
}
