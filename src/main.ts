import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import {NestExpressApplication} from "@nestjs/platform-express"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    credentials:true,
    origin:process.env.NODE_ENV === "production"?'https://factura-frontend.vercel.app':'http://localhost:3000',
  })
  app.set('trust proxy',true)
  app.useGlobalPipes(new ValidationPipe());
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app)
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
