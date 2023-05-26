import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/prisma/prisma.module';
import { LogsController } from './logs.controller';
import { LogsRepository } from './logs.repository';
import { LogsService } from './logs.service';

@Module({
  imports: [PrismaModule],
  providers: [LogsService, LogsRepository],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}
