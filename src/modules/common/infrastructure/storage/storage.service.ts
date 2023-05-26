import { Injectable } from '@nestjs/common';

import { FileExistsChecker } from './file-checker';
import { FileDownloader } from './file-downloader';
import { FileRemover } from './file-remover';
import { FileUploader } from './file-uploader';

type CommonProps = {
  identifier: string;
};
type UploadProps = CommonProps & {
  file: Buffer;
};

export const StorageInjectable = [
  FileUploader,
  FileDownloader,
  FileRemover,
  FileExistsChecker,
];

@Injectable()
export class StorageService {
  constructor(
    private readonly uploader: FileUploader,
    private readonly downloader: FileDownloader,
    private readonly remover: FileRemover,
  ) {}

  protected async upload({ file, identifier }: UploadProps) {
    return this.uploader.call(file, identifier);
  }

  protected async download({ identifier }: CommonProps) {
    return this.downloader.call(identifier);
  }

  protected async delete({ identifier }: CommonProps) {
    return this.remover.call(identifier);
  }

  protected async share({ identifier }: CommonProps) {
    return this.downloader.share(identifier);
  }
}
