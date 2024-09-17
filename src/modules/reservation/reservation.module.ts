import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { EventEntity } from '../event/entities/event.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ReservationEntity,
        EventEntity,
        UserEntity
      ],
      ),
      AuthModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
