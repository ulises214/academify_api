import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request, Response } from 'express';

import { LogsService } from '../../logs/logs.service';
import { DomainException, ExceptionLog } from '../exceptions/domain.exception';

type ComplexResponseType = {
  response: {
    message: string;
  };
};
type SimpleResponseType = {
  message: string;
};

type ReturnType = {
  payload: string;
  statusCode: number;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter', {
    timestamp: true,
  });

  private readonly failureLogger = new Logger('ExceptionFilterFailure', {
    timestamp: true,
  });

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logService: LogsService,
  ) {}

  catch(e: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const path = this.getPath(ctx);
    let responseBody: ReturnType & { stack?: string };
    if (e instanceof HttpException) {
      responseBody = this.parseNetworkException(e);
    } else if (e instanceof DomainException) {
      responseBody = this.parseDomainException(e, ctx);
    } else {
      responseBody = this.parseOtherException(e);
    }

    this.saveLog(e, ctx).catch((e) => this.failureLogger.error(e));
    const { stack: _stack, ...rest } = responseBody;
    httpAdapter.reply(
      ctx.getResponse(),
      {
        path,
        status: false,
        ...rest,
      },
      200,
    );
  }

  private getResponseMessage(exception: HttpException): string {
    const response = exception.getResponse();
    const hasResponse = Object.prototype.hasOwnProperty.call(
      response,
      'response',
    );

    return hasResponse
      ? (response as ComplexResponseType)['response']['message']
      : (response as SimpleResponseType)['message'];
  }

  private parseNetworkException(e: HttpException): ReturnType {
    const status = e.getStatus();

    const message = this.getResponseMessage(e);

    return {
      payload: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };
  }

  private parseDomainException(
    e: DomainException,
    ctx: HttpArgumentsHost,
  ): ReturnType {
    const req = ctx.getRequest<Request>();
    const { error, timestamp } = e.toLog(req);

    return {
      payload: error,
      statusCode: 400,
      timestamp: timestamp.toISOString(),
    };
  }

  private parseOtherException(e: unknown) {
    const timestamp = new Date().toISOString();
    if (e instanceof Error) {
      return {
        payload: e.message,
        statusCode: 500,
        timestamp,
        stack: e.stack,
      };
    }

    return {
      timestamp,
      statusCode: 500,
      payload: 'Unknown error',
    };
  }

  private getPath(ctx: HttpArgumentsHost): string {
    return this.httpAdapterHost.httpAdapter.getRequestUrl(
      ctx.getRequest<Request>(),
    ) as string;
  }

  private async saveLog(e: unknown, ctx: HttpArgumentsHost) {
    let log: ExceptionLog;
    const request = ctx.getRequest<Request>();
    if (e instanceof DomainException) {
      log = e.toLog(request);
    } else if (e instanceof HttpException) {
      const res = e.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { headers, hostname, method, body } = request;
      log = {
        error: e.message,
        stack: e.stack,
        timestamp: new Date(),
        type: e.name,
        request: {
          headers,
          hostname,
          method,
          body: JSON.stringify(body),
        },
        response: typeof res === 'string' ? { reason: res } : res,
      };
    } else {
      const { payload, stack } = this.parseOtherException(e);
      this.logger.error(e);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { headers, hostname, method, body } = ctx.getRequest<Request>();
      const res = ctx.getResponse<Response>();
      log = {
        error: payload,
        type: 'UNKNOWN _ERROR',
        request: {
          headers,
          hostname,
          method,
          body: JSON.stringify(body),
        },
        response: {
          headers: res.getHeaders(),
        },
        timestamp: new Date(),
        stack,
      };
    }

    await this.logService.saveLog({
      ...log,
    });
  }
}
