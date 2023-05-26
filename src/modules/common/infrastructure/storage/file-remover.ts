import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

import { FileExistsChecker } from './file-checker';
import { StorageConfigService } from './storage.config';

@Injectable()
export class FileRemover {
  private readonly logger = new Logger(FileRemover.name, {
    timestamp: true,
  });

  constructor(
    @Inject(MINIO_CONNECTION) private readonly client: Client,
    private readonly config: StorageConfigService,
    private readonly exits: FileExistsChecker,
  ) {}

  async call(key: string) {
    try {
      const exist = await this.exits.call(key);
      if (!exist) {
        return;
      }
      await this.client.removeObject(this.config.bucket, key);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
