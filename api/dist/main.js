"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const bodyParser = require("body-parser");
async function bootstrap() {
    try {
        const port = 8080;
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.use(bodyParser.json({ limit: '10mb' }));
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.enableCors({
            origin: [
                'http://localhost:3000',
                'https://fortiweb.salvador.ba.gov.br'
            ],
            methods: 'GET, POST, PUT, DELETE, PATCH',
            allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        });
        await app.listen(port);
        console.log(`LOCAL:  200 🟢 | Server running locally on http://localhost:${port}/
      DEPLOY: 200 🟢 | Server deployed at https://fortiweb.salvador.ba.gov.br
      Call support for help ONLY IF necessary.
      `);
        process.on('SIGINT', async () => {
            await app.close();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start the serverdd', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map