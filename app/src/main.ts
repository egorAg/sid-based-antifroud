import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';

import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import cookie from '@fastify/cookie';
import {ValidationPipe} from "@nestjs/common";
import {AppConfigService} from "./config/config.service";
import {ConfigVariables} from "./config/env/env.keys";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
  );

  const appConfig = app.get(AppConfigService);

  await app.register(swagger, {
    swagger: {
      info: {
        title: 'SID-based Anti-Fraud API',
        description: 'API documentation for anti-fraud system',
        version: '1.0.0',
      },
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/fastify-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  const config = new DocumentBuilder()
      .setTitle('SID Anti-Fraud API')
      .setDescription('Documentation for SID-based Anti-Fraud service')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.register(cookie);

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
  );

  await app.listen(appConfig.get(ConfigVariables.PORT), '0.0.0.0');
}

void bootstrap();
