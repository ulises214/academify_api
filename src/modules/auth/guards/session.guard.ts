import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    return (
      (request.session as unknown as Record<string, unknown>).user !== undefined
    );
  }
}
