import { Prisma } from '@prisma/client';

export class SaveLogDTO {
  timestamp!: Date;
  request!: Prisma.InputJsonValue;
  response!: Prisma.InputJsonValue;
  type!: string;
  stack?: string;
  error!: string;
}
