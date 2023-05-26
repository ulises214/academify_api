import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class StudentAlreadySubscribed extends DomainException {
  override type = 'StudentAlreadySubscribed';

  constructor(
    private readonly data: {
      courseId: string;
      studentId: string;
    },
    stack?: string,
  ) {
    super(`Course already subscribed`, { stack });
  }

  override toLog(): ExceptionLog {
    return {
      error: this.message,
      request: {
        courseId: this.data.courseId,
        studentId: this.data.studentId,
      },
      response: {
        message: `Student with id ${this.data.studentId} already subscribed to course with id ${this.data.courseId}`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
