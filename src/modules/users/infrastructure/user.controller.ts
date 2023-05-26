import {
  Controller,
  Get,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoggedSession } from '../../auth/domain/session-user';
import { SessionGuard } from '../../auth/guards/session.guard';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  @UseGuards(SessionGuard)
  async whoami(@Session() session: LoggedSession) {
    const sessionUser = session.user;
    const user = await this.usersService.findByEmail.execute(
      sessionUser.attributes.uCorreo,
    );
    const role = user?.role;
    if (!role) {
      throw new UnauthorizedException();
    }

    const attributes = sessionUser.attributes;

    const {
      id: _,
      studentId: __,
      teacherId: ___,
      ...userWithoutId
    } = attributes;

    return userWithoutId;
  }
}
