import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

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

  @Column({name: 'updated_at'})
  updatedAt!: number;

  @Column()
  status!: ItemThumbUpStatus;
}
