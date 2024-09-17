import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Roles } from "src/common/enums/role.enum";
import { ReservationEntity } from "src/modules/reservation/entities/reservation.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
    @Column({ unique: true, nullable: true })
    phone: string;
    @Column({ default: Roles.USER })
    role: string;
    @OneToOne(() => OtpEntity, otp => otp.user, { nullable: true })
    @JoinColumn()
    otp: OtpEntity;
    @OneToMany(() => ReservationEntity, reservation => reservation.user)
    reservations: ReservationEntity[];
}
