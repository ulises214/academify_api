import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate, ValidationError } from 'class-validator';

import { FeatureConfigException } from './feature.config.exception';

const mapErrors = (errors: ValidationError[]) => {
  return errors.map((v) => {
    return {
      property: v.property,
      constraints: v.constraints,
    };
  });
};

export abstract class FeatureConfig implements OnModuleInit {
  private readonly name = this.constructor.name;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const result = await validate(this);
    if (result.length > 0) {
      throw new FeatureConfigException(
        this.name,
        `Configuration failed - Is there an environment variable missing?`,
        JSON.stringify(mapErrors(result), null, 2),
      );
    }
  }

  protected get<T>(key: string): T | undefined {
    return this.config.get(key);
  }

  protected getOrThrow(key: string): string {
    const value = this.get(key);
    if (value === undefined || value === null) {
      throw new FeatureConfigException(
        key,
        `Error getting configuration value - Key: ${key}`,
      );
    }

    return String(value);
  }
}
