import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
      EventEntity,
      CategoryEntity
      ]),
      AuthModule
    ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
