import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

async function bootstrap() {
  // 👇 Verificación de la variable de entorno
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  // 1. Cookie parser — necesario para leer httpOnly cookies
  app.use(cookieParser());

  // 2. CORS — permite peticiones desde el frontend con cookies
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // 3. Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 4. Swagger
  const config = new DocumentBuilder()
    .setTitle('GESLAB API')
    .setDescription('Sistema de Gestión de Turnos y Bienestar Laboral')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log('🚀 GESLAB Backend corriendo en http://localhost:3001');
  console.log('📚 Swagger en http://localhost:3001/api/docs');
}
bootstrap();
