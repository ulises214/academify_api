import {
  DomainException,
  ExceptionLog,
} from '../../common/exceptions/domain.exception';

export class FileNotUploaded extends DomainException {
  override type = 'FileNotUploaded';

  constructor(
    private readonly data: {
      file: Express.Multer.File;
      type: 'homework' | 'assignment';
    },
    stack?: string,
  ) {
    super(`File not uploaded`, { stack });
  }

  override toLog(): ExceptionLog {
    const { file, type } = this.data;

    return {
      error: this.message,
      request: {
        file: {
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
        },
        type,
      },
      response: {
        message: `File ${file.originalname} not uploaded`,
      },
      timestamp: new Date(),
      type: this.type,
      stack: this.stack,
    };
  }
}
