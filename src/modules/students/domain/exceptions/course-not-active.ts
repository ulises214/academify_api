import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class CourseNotActive extends DomainException {
  override type = 'CourseNotActive';

  constructor(
    private readonly data: {
      courseId: string;
      studentId: string;
    },
    stack?: string,
  ) {
    super(`Course not active`, { stack });
  }

  override toLog(): ExceptionLog {
    return {
      error: this.message,
      request: {
        courseId: this.data.courseId,
        studentId: this.data.studentId,
      },
      response: {
        message: `Course with id ${this.data.courseId} is not active`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
