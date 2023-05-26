import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { DomainException } from '../../common/exceptions/domain.exception';

@Injectable()
export class FileNotFound extends DomainException {
  override type = 'FileNotFound';

  constructor(
    private readonly data: {
      fileId: string;
      requiredByRole: UserRole;
      requiredById: string;
    },
    stack?: string,
  ) {
    super('File not found', { stack });
  }

  override toLog() {
    return {
      request: this.data,
      response: {
        message: this.message,
      },
      error: this.message,
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
