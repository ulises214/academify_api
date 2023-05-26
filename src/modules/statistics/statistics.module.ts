import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/user.module';
import { GetCoursesStatisticsUseCase } from './application/use-cases/get-courses-statistics.use-case';
import { GetStudentsStatistics } from './application/use-cases/get-students-statistics.use-case';
import { GetTeacherStatisticsUseCase } from './application/use-cases/get-teacher-statistics.use-case';
import { StatisticsController } from './infrastructure/statistics.controller';
import { StatisticsService } from './infrastructure/statistics.service';

@Module({
  controllers: [StatisticsController],
  imports: [PrismaModule, UsersModule],
  providers: [
    StatisticsService,
    GetCoursesStatisticsUseCase,
    GetStudentsStatistics,
    GetTeacherStatisticsUseCase,
  ],
})
export class StatisticsModule {}
