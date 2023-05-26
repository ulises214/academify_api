import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { LoggedSession } from '../../../auth/domain/session-user';
import { getAllowedRoles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = getAllowedRoles(this.reflector, context);

    if (!roles) {
      return false;
    }

    const session = context.switchToHttp().getRequest<Request>()
      .session as unknown as Partial<LoggedSession> | undefined;

    const user = session?.user;

    if (!user) {
      return false;
    }

    return roles.includes(user.attributes.role);
  }
}
