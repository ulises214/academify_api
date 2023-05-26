import { Prisma } from '@prisma/client';
import type { Request } from 'express';

export type ExceptionLog = {
  request: Prisma.InputJsonValue;
  response: Prisma.InputJsonValue;
  error: string;
  timestamp: Date;
  type: string;
  stack?: string;
};
export abstract class DomainException extends Error {
  override readonly name = this.constructor.name;

  constructor(override readonly message: string, extra: { stack?: string }) {
    super();
    this.stack = extra.stack;
  }

  abstract get type(): string;
  abstract toLog(request?: Request): ExceptionLog;
}
