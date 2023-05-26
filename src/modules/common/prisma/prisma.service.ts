import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name, {
    timestamp: true,
  });

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.debug(`Connected to Prisma`);
  }

  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit', () => {
      app.close().catch((err) => {
        console.error(err);
        process.exit(1);
      });
    });
  }
}
