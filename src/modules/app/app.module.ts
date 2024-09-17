import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../category/category.module";
import { EventModule } from "../event/event.module";
import { ReservationModule } from "../reservation/reservation.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: join(process.cwd(), ".env")
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    EventModule,
    ReservationModule
],
    controllers: [],
    providers: []
})
export class AppModule {}