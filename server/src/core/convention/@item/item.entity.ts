import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ItemStatus {
  deleted,
  normal,
}

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

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @Column({name: 'deleted_at', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @Column()
  status!: ItemStatus;
}
