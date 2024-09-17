import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { EventEntity } from "src/modules/event/entities/event.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
    @Column()
    title: string;

    @OneToMany(() => EventEntity, event => event.category)
    events: EventEntity[];
}
