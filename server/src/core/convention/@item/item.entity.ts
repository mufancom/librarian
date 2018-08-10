import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('convention_item')
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'order_id'})
  orderId!: number;

  @Column({name: 'convention_id'})
  conventionId!: number;

  @Column()
  content!: string;

  @Column({name: 'version_id'})
  versionId!: number;

  @Column({name: 'comment_count'})
  commentCount!: number;

  @Column({name: 'thumb_up_count'})
  thumbUpCount!: number;

  @Column({name: 'created_at'})
  createdAt!: number;

  @Column({name: 'status'})
  status!: number;
}