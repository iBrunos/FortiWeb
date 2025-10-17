import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const port = 8080; // Porta do servidor
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(bodyParser.json({ limit: '10mb' }));
    app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://fortiweb.salvador.ba.gov.br'
      ],
      methods: 'GET, POST, PUT, DELETE, PATCH',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    });

    // --- Swagger configuration ---
    const config = new DocumentBuilder()
      .setTitle('FortiWeb API')
      .setDescription('Documentação da API FortiWeb de Salvador')
      .setVersion('1.0')
      .addBearerAuth() // habilita JWT no Swagger
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // acessa via /api

    // --- Inicialização do servidor ---
    await app.listen(port);
    console.log(`
      LOCAL:  🟢 200 | Server running locally on http://localhost:${port}/
      DEPLOY: 🟢 200 | Server deployed at https://fortiweb.salvador.ba.gov.br
      SWAGGER: 🟢 200 | Docs available at http://localhost:${port}/api
      Call support for help ONLY IF necessary.
    `);

    // Manipulador de sinal para encerrar corretamente o servidor
    process.on('SIGINT', async () => {
      await app.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
  }
}

bootstrap();