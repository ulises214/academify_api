// eslint-disable-next-line simple-import-sort/imports
import { Module } from '@nestjs/common';

import { FeatureConfigModule } from '../common/config/feature.config.module';
import {
  StorageConfig,
  StorageConfigService,
} from '../common/infrastructure/storage/storage.config';
import { PrismaModule } from '../common/prisma/prisma.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/user.module';
import { ActivateHomeWork } from './application/use-cases/activate-homework.user-case';
import { CreateCourse } from './application/use-cases/create-course.use-case';
import { CreateHomework } from './application/use-cases/create-homework.use-case';
import { DeleteCourse } from './application/use-cases/delete-curse.use-case';
import { GetCourseHomeWorks } from './application/use-cases/get-course-homeworks.use-case';
import { GetHomeworkAssignments } from './application/use-cases/get-homework-assignments.use-case';
import { GetHomeWorkDetails } from './application/use-cases/get-homework-details.use-case';
import { GetTeacherCourses } from './application/use-cases/get-teacher-courses.use-case';
import { RateAssignment } from './application/use-cases/rate-assignment.use-case';
import { UpdateCourse } from './application/use-cases/update-course.use-case';
import { TeachersCoursesController } from './infrastructure/teacher-courses.controller';
import { TeacherHomeworksController } from './infrastructure/teacher-homeworks.controller';
import { TeachersController } from './infrastructure/teacher.controller';
import { TeachersService } from './infrastructure/teacher.service';

@Module({
  controllers: [
    TeachersController,
    TeachersCoursesController,
    TeacherHomeworksController,
  ],
  imports: [
    PrismaModule,
    UsersModule,
    FeatureConfigModule.forFeature(StorageConfigService, StorageConfig),
    FilesModule,
  ],
  providers: [
    TeachersService,
    CreateCourse,
    GetTeacherCourses,
    CreateHomework,
    ActivateHomeWork,
    GetCourseHomeWorks,
    GetHomeWorkDetails,
    GetHomeworkAssignments,
    RateAssignment,
    UpdateCourse,
    DeleteCourse,
  ],
})
export class TeachersModule {}
