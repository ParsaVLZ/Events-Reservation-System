import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { SwaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";

async function bootstrap(){
    const app = await NestFactory.create(AppModule);
    SwaggerConfigInit(app);
    app.useGlobalPipes(new ValidationPipe())
    app.use(cookieParser(process.env.COOKIE_SECRET));
    const { PORT } = process.env;
    await app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`); 
        console.log(`swagger: http://localhost:${PORT}/swagger`);
    });
}
bootstrap();