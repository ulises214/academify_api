import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class FindUserByEmail {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
