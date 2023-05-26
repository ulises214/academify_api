import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class CourseNotFound extends DomainException {
  override type = 'CourseNotFound';

  constructor(
    private readonly data: {
      code?: string;
      studentId?: string;
      courseId?: string;
    },
    stack?: string,
  ) {
    super(`Course not exists`, { stack });
  }

  override toLog(): ExceptionLog {
    const { code, courseId, studentId } = this.data;

    return {
      error: this.message,
      request: {
        courseCode: code,
        studentId,
        courseId,
      },
      response: {
        message: `Course with code ${code ?? courseId ?? ''} not exists`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
