import { Injectable, Logger } from '@nestjs/common';

import { SaveLogDTO } from './application/dto/save.log.dto';
import { LogsRepository } from './logs.repository';

@Injectable()
export class LogsService {
  private readonly loggger = new Logger(LogsService.name);
  constructor(private readonly logsRepo: LogsRepository) {}

  async saveLog(dto: SaveLogDTO) {
    try {
      await this.logsRepo.saveLog(dto);
    } catch (e) {
      this.loggger.error(e);
      this.loggger.error(dto);
    }
  }

  async getAll() {
    return this.logsRepo.getAll();
  }
}
