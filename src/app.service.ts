import { Injectable } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsString } from 'class-validator';

import { FeatureConfig } from './modules/common/config/feature.config.service';

export const AppConfig = registerAs('app', () => ({
  port: process.env.APP_PORT ?? 3000,
  env: process.env.NODE_ENV ?? 'development',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',
}));

@Injectable()
export class AppConfigService extends FeatureConfig {
  @IsInt()
  get port(): number {
    const rawNumber = this.getOrThrow('app.port');

    return Number(rawNumber);
  }

  @IsString()
  @IsEnum(['development', 'production', 'test'])
  get env() {
    return this.getOrThrow('app.env');
  }

  @IsString()
  get appUrl() {
    return this.getOrThrow('app.appUrl');
  }
}
