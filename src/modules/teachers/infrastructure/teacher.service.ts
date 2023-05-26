import { Injectable } from '@nestjs/common';

import { CreateCourseDTO } from '../application/dto/create-course.dto';
import { CreateHomeworkDto } from '../application/dto/create-homework';
import { ActivateHomeWork } from '../application/use-cases/activate-homework.user-case';
import { CreateCourse } from '../application/use-cases/create-course.use-case';
import { CreateHomework } from '../application/use-cases/create-homework.use-case';
import { DeleteCourse } from '../application/use-cases/delete-curse.use-case';
import { GetCourseHomeWorks } from '../application/use-cases/get-course-homeworks.use-case';
import { GetHomeworkAssignments } from '../application/use-cases/get-homework-assignments.use-case';
import { GetHomeWorkDetails } from '../application/use-cases/get-homework-details.use-case';
import { GetTeacherCourses } from '../application/use-cases/get-teacher-courses.use-case';
import { RateAssignment } from '../application/use-cases/rate-assignment.use-case';
import { UpdateCourse } from '../application/use-cases/update-course.use-case';

@Injectable()
export class TeachersService {
  constructor(
    private readonly _createCourse: CreateCourse,
    private readonly _getCourses: GetTeacherCourses,
    private readonly _createHomework: CreateHomework,
    private readonly _activateHomework: ActivateHomeWork,
    private readonly _getCourseHomeworks: GetCourseHomeWorks,
    private readonly _getHomeworkDetails: GetHomeWorkDetails,
    private readonly _getHomeworkAssignments: GetHomeworkAssignments,
    private readonly _rateAssignment: RateAssignment,
    private readonly _updateCourse: UpdateCourse,
    private readonly _deleteCourse: DeleteCourse,
  ) {}

  async createCourse(data: CreateCourseDTO, teacherId: string) {
    return this._createCourse.execute(data, { teacherId });
  }

  async getCourses(teacherId: string) {
    return this._getCourses.execute(teacherId);
  }

  async createHomework(data: CreateHomeworkDto, teacherId: string) {
    return this._createHomework.execute(data, { teacherId });
  }

  async activateHomework(homeworkId: string, teacherId: string) {
    return this._activateHomework.execute(homeworkId, teacherId);
  }

  async getCourseHomeworks(courseId: string, teacherId: string) {
    return this._getCourseHomeworks.execute({ courseId, teacherId });
  }

  async getHomeworkDetails(homeworkId: string, teacherId: string) {
    return this._getHomeworkDetails.execute({ homeworkId, teacherId });
  }

  async getHomeworkAssignments(homeworkId: string, teacherId: string) {
    return this._getHomeworkAssignments.execute({ homeworkId, teacherId });
  }

  async rateAssignment(teacherId: string, assignmentId: string, rate: number) {
    return this._rateAssignment.execute(teacherId, assignmentId, rate);
  }

  async updateCourse(
    courseId: string,
    data: CreateCourseDTO,
    teacherId: string,
  ) {
    return this._updateCourse.execute({ courseId, data, teacherId });
  }

  async deleteCourse(courseId: string, teacherId: string) {
    return this._deleteCourse.execute({ courseId, teacherId });
  }
}
