import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemStatus {
  deleted,
  normal,
}

@Entity('convention_item')
@Index(['content'], {fulltext: true})
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'order_id'})
  orderId!: number;

  @Column({name: 'convention_id'})
  conventionId!: number;

  @Column({type: 'longtext'})
  content!: string;

  @Column({name: 'contains_iveread'})
  containsIveRead!: 0 | 1;

  @Column({name: 'version_id'})
  versionId!: number;

  @Column({name: 'version_hash'})
  versionHash!: string;

  @Column({name: 'version_created_at', type: 'timestamp'})
  versionCreatedAt!: Date;

  @Column({name: 'comment_count'})
  commentCount!: number;

  @Column({name: 'thumb_up_count'})
  thumbUpCount!: number;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt!: Date;

  @Column({name: 'deleted_at', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @Column()
  status!: ItemStatus;
}
