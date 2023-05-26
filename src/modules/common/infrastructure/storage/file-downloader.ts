import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import internal from 'stream';

import { FileExistsChecker } from './file-checker';
import { StorageConfigService } from './storage.config';

@Injectable()
export class FileDownloader {
  private readonly logger = new Logger(FileDownloader.name, {
    timestamp: true,
  });

  constructor(
    @Inject(MINIO_CONNECTION) private readonly client: Client,
    private readonly config: StorageConfigService,
    private readonly exists: FileExistsChecker,
  ) {}

  async call(key: string): Promise<Buffer | undefined> {
    const exists = await this.exists.call(key);
    if (!exists) {
      return;
    }

    return new Promise((resolve) => {
      const buff: Uint8Array[] = [];

      this.client.getObject(
        this.config.bucket,
        key,
        (err, dataStream?: internal.Stream) => {
          if (err) {
            resolve(undefined);

            return;
          }

          if (!dataStream) {
            resolve(undefined);

            return;
          }

          dataStream.on('data', function (chunk) {
            buff.push(chunk as Uint8Array);
          });
          dataStream.on('end', function () {
            const buf = Buffer.concat(buff);
            resolve(buf);
          });
          dataStream.on('error', (err) => {
            this.logger.error(err);
            resolve(undefined);
          });
        },
      );
    });
  }

  async share(key: string): Promise<string | undefined> {
    const exists = await this.exists.call(key);
    if (!exists) {
      return;
    }

    // 48 hours
    return this.client.presignedGetObject(
      this.config.bucket,
      key,
      48 * 60 * 60,
    );
  }
}
