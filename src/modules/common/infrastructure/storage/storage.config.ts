import { Injectable } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { FeatureConfig } from '../../config/feature.config.service';

export const StorageConfig = registerAs('storage', () => ({
  url: process.env.S3_URL,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  bucket: process.env.S3_BUCKET,
  secure: process.env.S3_SECURE,
  port: process.env.S3_PORT,
}));

@Injectable()
export class StorageConfigService extends FeatureConfig {
  @IsString()
  @IsIP()
  get url() {
    return this.getOrThrow('storage.url');
  }

  @IsString()
  @IsNotEmpty()
  get accessKey() {
    return this.getOrThrow('storage.accessKeyId');
  }

  @IsString()
  @IsNotEmpty()
  get secretKey() {
    return this.getOrThrow('storage.secretAccessKey');
  }

  @IsString()
  @IsNotEmpty()
  get bucket() {
    return this.getOrThrow('storage.bucket');
  }

  @IsBoolean()
  get secure(): boolean {
    return Boolean(this.getOrThrow('storage.secure'));
  }

  @IsNumber()
  @IsInt()
  get port(): number {
    return Number(this.getOrThrow('storage.port'));
  }
}
