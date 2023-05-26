import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/prisma/prisma.module';
import { FindUserByEmail } from './application/use-cases/find-by-id.use-case';
import { FindUserOrCreate } from './application/use-cases/find-or-create.use-case';
import { UserController } from './infrastructure/user.controller';
import { UsersService } from './infrastructure/user.service';

@Module({
  providers: [UsersService, FindUserOrCreate, FindUserByEmail],
  exports: [UsersService],
  imports: [PrismaModule],
  controllers: [UserController],
})
export class UsersModule {}
