import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '@node-saml/passport-saml/lib/types';
import type { Response } from 'express';

import { UsersService } from '../../users/infrastructure/user.service';
import { AuthConfigService } from '../config/auth.config';
import { SamlReqUser } from '../domain/saml-req-user';
import { LoggedSession } from '../domain/session-user';
import { UcolGuard } from '../guards/udc.guard';
import { SamlStrategy } from '../strategies/saml.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly samlStrategy: SamlStrategy,
    private readonly authConfig: AuthConfigService,
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  @UseGuards(UcolGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login() {}

  @Post('login/callback')
  @UseGuards(UcolGuard)
  async callback(
    @Req() req: SamlReqUser,
    @Res() res: Response,
    @Session() session: LoggedSession,
  ) {
    const { id, role, student, teacher } =
      await this.userService.findOrCreate.execute(req.user.attributes);

    session.user = {
      ...req.user,
      attributes: {
        ...req.user.attributes,
        id,
        role,
        studentId: student?.id,
        teacherId: teacher?.id,
      },
    };

    res.redirect(this.authConfig.appUrl);
  }

  @Get('logout')
  logout(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Session() session: LoggedSession,
  ) {
    req.user = session.user;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete session.user;
    this.samlStrategy.logout(req, (_err, request) => {
      if (request) {
        res.redirect(request);
      } else {
        res.redirect(this.authConfig.appUrl);
      }
    });
  }

  @Post('logout/callback')
  logoutCallback(
    @Session() session: LoggedSession,

    @Res() res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete session.user;
    res.redirect(this.authConfig.appUrl);
  }

  @Get('metadata.xml')
  metadata(@Res() res: Response) {
    const content = this.samlStrategy.generateServiceProviderMetadata(
      this.authConfig.privateCert,
    );
    res.type('application/xml');
    res.status(200).send(content);
  }
}
