import { registerAs } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import fs from 'fs';

import { FeatureConfig } from '../../common/config/feature.config.service';

export const AuthConfig = registerAs('auth', () => ({
  cert: process.env.CERTS_PATH,
}));
export class AuthConfigService extends FeatureConfig {
  @IsString()
  @IsNotEmpty()
  get certsFolder(): string {
    return this.getOrThrow('auth.cert');
  }

  get cert(): string {
    return fs.readFileSync(`${this.certsFolder}/idp.crt`, 'utf-8');
  }

  get decryptionPvk(): string {
    return fs.readFileSync(`${this.certsFolder}/key.pem`, 'utf-8');
  }

  get privateCert(): string {
    return fs.readFileSync(`${this.certsFolder}/cert.pem`, 'utf-8');
  }

  @IsEnum(['development', 'production'])
  get env(): 'development' | 'production' {
    return this.getOrThrow('app.env') as 'development' | 'production';
  }

  get appUrl(): string {
    if (this.env === 'development') {
      return 'http://localhost:5173/';
    }

    return 'https://academify.live/';
  }

  getDevProfile() {
    return {
      callbackUrl: 'http://localhost:4006/api/auth/login/callback',
      entryPoint: 'https://wayf.ucol.mx/saml2/idp/SSOService.php',
      cert: this.cert,
      decryptionPvk: this.decryptionPvk,
      privateCert: this.privateCert,
      logoutUrl: 'https://wayf.ucol.mx/saml2/idp/SingleLogoutService.php',
      logoutCallbackUrl: 'http://localhost:4006/api/auth/logout/callback',
      issuer: 'http://localhost/20166936',
    };
  }

  getProdProfile() {
    return {
      callbackUrl: 'https://academify.live/api/auth/login/callback',
      entryPoint: 'https://wayf.ucol.mx/saml2/idp/SSOService.php',
      cert: this.cert,
      decryptionPvk: this.decryptionPvk,
      privateCert: this.privateCert,
      logoutUrl: 'https://wayf.ucol.mx/saml2/idp/SingleLogoutService.php',
      logoutCallbackUrl: 'http://academify.live/api/auth/logout/callback',
      issuer: 'https://academify.live/20166936',
    };
  }
}
