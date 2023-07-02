import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LOGS_LEVEL(),
  });
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(PORT).then(() => Logger.log(`
      TWIKKL API IS RUNNING ON PORT ${PORT}
    `))
}

bootstrap();
function LOGS_LEVEL(): false | import("@nestjs/common").LoggerService | import("@nestjs/common").LogLevel[] {
  throw new Error('Function not implemented.');
}

