import {
  DomainException,
  ExceptionLog,
} from '../../../common/exceptions/domain.exception';

export class CourseNotOwns extends DomainException {
  override type = 'CourseNotOwns';

  constructor(
    private readonly data: {
      courseId?: string;
      homeworkId?: string;
      assignmentId?: string;
      teacherId: string;
      action:
        | 'uploadFile'
        | 'createHomework'
        | 'activateHomeWork'
        | 'getCourseHomeWorks'
        | 'getHomeWorkDetails'
        | 'getHomeWorkAssignments'
        | 'rateAssignment'
        | 'updateCourse'
        | 'deleteCourse';
    },
    stack?: string,
  ) {
    super(`Course not owns`, { stack });
  }

  override toLog(): ExceptionLog {
    const { action, teacherId, courseId, homeworkId, assignmentId } = this.data;

    return {
      error: this.message,
      request: {
        courseId,
        teacherId,
        action,
        homeworkId,
        assignmentId,
      },
      response: {
        message: this._getMessage(),
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }

  private _getMessage() {
    switch (this.data.action) {
      case 'uploadFile':
      case 'createHomework':
      case 'getCourseHomeWorks':
        return `Course with id ${
          this.data.courseId ?? ''
        } not owns by teacher with id ${this.data.teacherId}`;
      default:
        return `Homework with id ${
          this.data.homeworkId ?? ''
        } not owns by teacher with id ${this.data.teacherId}`;
    }
  }
}
