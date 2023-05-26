import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppConfig, AppConfigService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FeatureConfigModule } from './modules/common/config/feature.config.module';
import { TransformInterceptor } from './modules/common/interceptors/transform.interceptor';
import { LogsModule } from './modules/logs/logs.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { UsersModule } from './modules/users/user.module';

@Module({
  imports: [
    FeatureConfigModule.forFeature(AppConfigService, AppConfig),
    LogsModule,
    AuthModule,
    UsersModule,
    StatisticsModule,
    StudentsModule,
    TeachersModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
  controllers: [AppController],
})
export class AppModule {}
