import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { SamlUserAttributes } from '../../../auth/domain/saml-user';
import { PrismaService } from '../../../common/prisma/prisma.service';

type CreatedUser = {
  id: string;
  role: UserRole;
  teacher: {
    id: string;
  } | null;
  student: {
    id: string;
  } | null;
};
@Injectable()
export class FindUserOrCreate {
  constructor(private readonly prisma: PrismaService) {}
  async execute(user: SamlUserAttributes): Promise<CreatedUser> {
    const select = {
      id: true,
      role: true,
      teacher: {
        select: {
          id: true,
        },
      },
      student: {
        select: {
          id: true,
        },
      },
    };

    const userExisting = await this.prisma.user.findUnique({
      where: {
        email: user.uCorreo,
      },
      select,
    });
    if (userExisting) {
      return userExisting;
    }

    const isStudent = user.uTipo === 'Estudiante';

    return this.prisma.user.create({
      data: {
        email: user.uCorreo,
        name: user.uNombre,
        role: isStudent ? 'STUDENT' : 'TEACHER',
        student: isStudent ? { create: {} } : undefined,
        teacher: !isStudent ? { create: {} } : undefined,
      },
      select,
    });
  }
}
