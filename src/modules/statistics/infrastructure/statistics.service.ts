import { Injectable } from '@nestjs/common';

import { GetCoursesStatisticsUseCase } from '../application/use-cases/get-courses-statistics.use-case';
import { GetStudentsStatistics } from '../application/use-cases/get-students-statistics.use-case';
import { GetTeacherStatisticsUseCase } from '../application/use-cases/get-teacher-statistics.use-case';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly getCourseCount: GetCoursesStatisticsUseCase,
    private readonly getStudentsCount: GetStudentsStatistics,
    private readonly getTeachersCount: GetTeacherStatisticsUseCase,
  ) {}

  async getCounts() {
    const courses = await this.getCourseCount.count();
    const students = await this.getStudentsCount.count();
    const teachers = await this.getTeachersCount.count();

    return {
      courses,
      students,
      teachers,
    };
  }
}
