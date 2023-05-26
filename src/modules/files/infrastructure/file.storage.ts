import { Injectable } from '@nestjs/common';

import { StorageService } from '../../common/infrastructure/storage/storage.service';

@Injectable()
export class FileStorageService extends StorageService {
  async saveFile(buffer: Buffer, id: string): Promise<[string, boolean]> {
    const status = await this.upload({
      file: buffer,
      identifier: id,
    });

    return [id, status];
  }

  async deleteFile(id: string) {
    await this.delete({ identifier: id });
  }

  async downloadFile(id: string) {
    return await this.download({ identifier: id });
  }
}
