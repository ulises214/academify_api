import { CustomDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

export const USER_ROLE_KEY = 'nebuiaAuth';

export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(USER_ROLE_KEY, roles);

export const getAllowedRoles = (
  reflector: Reflector,
  context: ExecutionContext,
) => {
  const roles = reflector.get<UserRole[] | undefined>(
    USER_ROLE_KEY,
    context.getHandler(),
  );
  if (roles && roles.length) {
    return roles;
  }

  return undefined;
};
