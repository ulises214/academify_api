import { Injectable } from '@nestjs/common';

import { DeliverHomeWork } from '../application/use-cases/deliver-homework.use-case';
import { GetStudentHomeWorkDetails } from '../application/use-cases/get-homework-details';
import { GetStudentCourseDetails } from '../application/use-cases/get-student-course-details.use-case';
import { GetStudentCourseHomeWorks } from '../application/use-cases/get-student-course-homeworks';
import { GetStudentCourses } from '../application/use-cases/get-student-courses';
import { JoinStudentToCourse } from '../application/use-cases/joint-to-course.use-case';

@Injectable()
export class StudentsService {
  constructor(
    private readonly _getCourses: GetStudentCourses,
    private readonly _jointToCourse: JoinStudentToCourse,
    private readonly _getAssignments: GetStudentCourseHomeWorks,
    private readonly _deliverHomework: DeliverHomeWork,
    private readonly _getStudentCourseDetails: GetStudentCourseDetails,
    private readonly _getStudentHomeWorkDetails: GetStudentHomeWorkDetails,
  ) {}

  async getCourses(studentId: string) {
    return this._getCourses.execute(studentId);
  }

  async joinToCourse(studentId: string, courseCode: string) {
    return this._jointToCourse.execute({ studentId, courseCode });
  }

  async getCourseHomeWorks(studentId: string, courseId: string) {
    return this._getAssignments.execute({ studentId, courseId });
  }

  async deliverHomework(studentId: string, homeWorkId: string) {
    return this._deliverHomework.execute({ studentId, homeWorkId });
  }

  async getCourse(studentId: string, courseId: string) {
    return this._getStudentCourseDetails.execute({ studentId, courseId });
  }

  async getHomeWork(studentId: string, homeWorkId: string) {
    return this._getStudentHomeWorkDetails.execute({ studentId, homeWorkId });
  }
}
