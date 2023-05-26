import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@node-saml/passport-saml';

import { AuthConfigService } from '../config/auth.config';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
  constructor(config: AuthConfigService) {
    super(
      config.env === 'development'
        ? config.getDevProfile()
        : config.getProdProfile(),
    );
  }

  validate(profile: unknown) {
    return profile;
  }
}
