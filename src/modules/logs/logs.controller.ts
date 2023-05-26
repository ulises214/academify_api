import { Controller, Get } from '@nestjs/common';

import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getAll() {
    const result = await this.logsService.getAll();

    return result;
  }
}
