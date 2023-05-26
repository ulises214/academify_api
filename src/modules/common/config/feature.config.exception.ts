import { DomainException } from '../exceptions/domain.exception';

export class FeatureConfigException extends DomainException {
  override type = 'FeatureConfigException';

  constructor(private readonly key: string, message: string, stack?: string) {
    super(message, { stack });
  }

  override toLog() {
    return {
      request: {
        key: this.key,
      },
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
