import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { FeatureConfigModule } from '../common/config/feature.config.module';
import { UsersModule } from '../users/user.module';
import { AuthConfig, AuthConfigService } from './config/auth.config';
import { AuthController } from './infrastructure/auth.controller';
import { SamlStrategy } from './strategies/saml.strategy';

@Module({
  imports: [
    FeatureConfigModule.forFeature(AuthConfigService, AuthConfig),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({ defaultStrategy: 'saml' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [SamlStrategy],
  exports: [],
})
export class AuthModule {}
