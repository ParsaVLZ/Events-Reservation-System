import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { ReservationStatus } from "../enums/reservation-status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { EventEntity } from "src/modules/event/entities/event.entity";

@Entity(EntityName.Reservation)
export class ReservationEntity extends BaseEntity{
    @Column()
    quantity: number;
    @Column('float')
    totalPrice: number; 
    @Column({default: ReservationStatus.PENDING})
    status: ReservationStatus;
    @ManyToOne(() => UserEntity, user => user.reservations, { onDelete: 'CASCADE' })
    user: UserEntity;  
    @ManyToOne(() => EventEntity, event => event.reservations, { onDelete: 'CASCADE' })
    event: EventEntity;
}
