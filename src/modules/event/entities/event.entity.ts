import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EventStatus } from "../enum/event-status.enum";
import { ReservationEntity } from "src/modules/reservation/entities/reservation.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { IsDate } from "class-validator";
import { EntityName } from "src/common/enums/entity.enum";

@Entity(EntityName.Event)
export class EventEntity extends BaseEntity {
    @Column()
    name: string;
    @Column()
    description: string;
    @Column('float')
    price: number;
    @Column({type: 'timestamp'})
    startTime: Date;
    @Column({type: 'timestamp'})
    endTime: Date;
    @Column()
    location: string;
    @Column({ type: 'enum', enum: EventStatus, default: EventStatus.OPEN})
    status: EventStatus;
    @ManyToOne(() => CategoryEntity, category => category.events)
    category: CategoryEntity;
    @OneToMany(() => ReservationEntity, reservation => reservation.event)
    reservations: ReservationEntity[];
}
