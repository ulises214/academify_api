import { Injectable } from '@nestjs/common';

import { FindUserByEmail } from '../application/use-cases/find-by-id.use-case';
import { FindUserOrCreate } from '../application/use-cases/find-or-create.use-case';

@Injectable()
export class UsersService {
  constructor(
    public readonly findOrCreate: FindUserOrCreate,
    public readonly findByEmail: FindUserByEmail,
  ) {}
}
