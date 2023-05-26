import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class StudentNotSubscribedToCourse extends DomainException {
  override type = 'StudentNotSubscribedToCourse';

  constructor(
    private readonly data: {
      courseId: string;
      studentId: string;
    },
    stack?: string,
  ) {
    super(`Student not subscribed to course`, { stack });
  }

  override toLog(): ExceptionLog {
    return {
      error: this.message,
      request: {
        courseId: this.data.courseId,
        studentId: this.data.studentId,
      },
      response: {
        message: `Student with id ${this.data.studentId} not subscribed to course with id ${this.data.courseId}`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
