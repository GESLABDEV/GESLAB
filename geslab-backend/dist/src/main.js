"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
async function bootstrap() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('GESLAB API')
        .setDescription('Sistema de Gestión de Turnos y Bienestar Laboral')
        .setVersion('1.0')
        .addCookieAuth('access_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3001);
    console.log('🚀 GESLAB Backend corriendo en http://localhost:3001');
    console.log('📚 Swagger en http://localhost:3001/api/docs');
}
bootstrap();
//# sourceMappingURL=main.js.map