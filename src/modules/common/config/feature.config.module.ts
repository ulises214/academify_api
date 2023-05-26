import { DynamicModule, Module, Type } from '@nestjs/common';
import {
  ConfigFactory,
  ConfigModule,
  ConfigObject,
  ConfigService,
} from '@nestjs/config';

@Module({})
export class FeatureConfigModule {
  static forFeature(
    Provide: Type,
    config: ConfigFactory<ConfigObject>,
  ): DynamicModule {
    return {
      module: FeatureConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: [
            '.env',
            '.env.local',
            process.env.NODE_ENV === 'production'
              ? '.env.production'
              : '.env.development',
          ],
          load: [config],
        }),
      ],
      providers: [
        {
          provide: Provide,
          useFactory: (configService: ConfigService) => {
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-return*/
            return new Provide(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [Provide],
    };
  }
}
