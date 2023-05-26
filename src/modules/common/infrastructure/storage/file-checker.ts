import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

import { StorageConfigService } from './storage.config';

@Injectable()
export class FileExistsChecker {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly client: Client,
    private readonly config: StorageConfigService,
  ) {}

  async call(key: string) {
    return new Promise<boolean>((resolve) => {
      this.client.statObject(this.config.bucket, key, (err) => {
        if (err) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
