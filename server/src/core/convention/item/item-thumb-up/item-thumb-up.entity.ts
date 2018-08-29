import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemThumbUpStatus {
  indifferent,
  liked,
}

@Entity('convention_item_thumb_up')
export class ItemThumbUp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'user_id'})
  userId!: number;

  @Column({name: 'convention_item_version_id'})
  itemVersionId!: number;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt!: Date;

  @Column()
  status!: ItemThumbUpStatus;
}
