import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';

import { FeatureConfigModule } from '../common/config/feature.config.module';
import {
  StorageConfig,
  StorageConfigService,
} from '../common/infrastructure/storage/storage.config';
import { StorageInjectable } from '../common/infrastructure/storage/storage.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/user.module';
import { DownloadAppFile } from './application/download-app-file.use-case';
import { UploadAssignmentFile } from './assignment/application/use-cases/upload-assignment-file.use-case';
import { UploadHomeWorkFile } from './homeworks/application/use-cases/upload-homework-file.use-case';
import { AssignmentFilesController } from './infrastructure/assignment-files.controller';
import { AssignmentFilesService } from './infrastructure/assignment-files.service';
import { FileStorageService } from './infrastructure/file.storage';
import { FilesController } from './infrastructure/files.controller';
import { FilesService } from './infrastructure/files.service';
import { HomeworkFilesController } from './infrastructure/homework-files.controller';
import { HomeWorksFilesService } from './infrastructure/homework-files.service';

@Module({
  imports: [
    PrismaModule,
    FeatureConfigModule.forFeature(StorageConfigService, StorageConfig),
    UsersModule,
    NestMinioModule.registerAsync({
      imports: [
        FeatureConfigModule.forFeature(StorageConfigService, StorageConfig),
      ],
      inject: [StorageConfigService],
      useFactory: (config: StorageConfigService) => ({
        endPoint: config.url,
        port: config.port,
        useSSL: false,
        accessKey: config.accessKey,
        secretKey: config.secretKey,
      }),
    }),
  ],
  controllers: [
    AssignmentFilesController,
    HomeworkFilesController,
    FilesController,
  ],
  providers: [
    AssignmentFilesService,
    HomeWorksFilesService,
    UploadAssignmentFile,
    UploadHomeWorkFile,
    FileStorageService,
    DownloadAppFile,
    FilesService,
    ...StorageInjectable,
  ],
})
export class FilesModule {}
