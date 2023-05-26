// eslint-disable-next-line simple-import-sort/imports
import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/user.module';
import { DeliverHomeWork } from './application/use-cases/deliver-homework.use-case';
import { GetStudentHomeWorkDetails } from './application/use-cases/get-homework-details';
import { GetStudentCourseDetails } from './application/use-cases/get-student-course-details.use-case';
import { GetStudentCourseHomeWorks } from './application/use-cases/get-student-course-homeworks';
import { GetStudentCourses } from './application/use-cases/get-student-courses';
import { JoinStudentToCourse } from './application/use-cases/joint-to-course.use-case';
import { StudentsHomeworksController } from './infrastructure/student-homeworks.controller';
import { StudentsCoursesController } from './infrastructure/students-courses.controller';
import { StudentsController } from './infrastructure/students.controller';
import { StudentsService } from './infrastructure/students.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [
    StudentsController,
    StudentsCoursesController,
    StudentsHomeworksController,
  ],
  providers: [
    StudentsService,
    GetStudentCourses,
    JoinStudentToCourse,
    GetStudentCourseHomeWorks,
    DeliverHomeWork,
    GetStudentCourseDetails,
    GetStudentHomeWorkDetails,
  ],
})
export class StudentsModule {}
