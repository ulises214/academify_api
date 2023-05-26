import { UserRole } from '@prisma/client';

import { SamlUser, SamlUserAttributes } from './saml-user';

export type SessionUser = SamlUser & {
  attributes: SamlUserAttributes & {
    id: string;
    role: UserRole;
    studentId?: string;
    teacherId?: string;
  };
};

export type LoggedSession = {
  user: SessionUser;
};
