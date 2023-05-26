import { BadRequestException, Controller, Get } from '@nestjs/common';

import { FeatureConfigException } from './modules/common/config/feature.config.exception';

@Controller('hello')
export class AppController {
  @Get()
  getHello() {
    return 'Hola pito';
  }

  @Get('error/400')
  getHttpError() {
    throw new BadRequestException('Vales verga');
  }

  @Get('error/unknown')
  getUnknownError() {
    throw new Error('Pito');
  }

  @Get('error/domain')
  getDomainError() {
    throw new FeatureConfigException('pito', 'Pito not found');
  }
}
