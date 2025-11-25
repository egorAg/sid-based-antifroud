import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
  );

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
    routePrefix: '/docs',
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
  SwaggerModule.setup('/nest-docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
