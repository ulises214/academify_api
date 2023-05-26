import type { Request } from 'express';

import { SamlUser } from './saml-user';

export type SamlReqUser = Request & {
  user: SamlUser;
};
