import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import session from 'express-session';
import passport from 'passport';

import { AppModule } from './app.module';
import { AppConfigService } from './app.service';
import { AllExceptionsFilter } from './modules/common/filter/all-exception.filter';
import { LogsService } from './modules/logs/logs.service';

// Initialize store.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);
  const logService = app.get(LogsService);
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(passport.initialize());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logService));
  app.enableCors({
    origin: ['https://wayf.ucol.mx', config.appUrl],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(config.port);

  Logger.log(`Server started at ${await app.getUrl()}`);
}
bootstrap().catch((err) => {
  console.error(err);
});
