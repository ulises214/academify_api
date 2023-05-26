import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

import { FileRemover } from './file-remover';
import { StorageConfigService } from './storage.config';

@Injectable()
export class FileUploader {
  private readonly logger = new Logger(FileUploader.name, {
    timestamp: true,
  });

  constructor(
    @Inject(MINIO_CONNECTION) private readonly client: Client,
    private readonly config: StorageConfigService,
    private readonly remover: FileRemover,
  ) {}

  async call(file: Buffer, key: string): Promise<boolean> {
    try {
      await this.remover.call(key);
      await this.client.putObject(this.config.bucket, key, file);

      return true;
    } catch (error) {
      this.logger.error(error);

      return false;
    }
  }
}
