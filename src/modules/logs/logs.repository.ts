import { Injectable } from '@nestjs/common';

import { PrismaService } from '../common/prisma/prisma.service';
import { SaveLogDTO } from './application/dto/save.log.dto';

@Injectable()
export class LogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveLog(data: SaveLogDTO) {
    await this.prisma.appLog.create({
      data,
    });
  }

  async getAll() {
    return await this.prisma.appLog.findMany();
  }
}
