import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemCommentStatus {
  deleted,
  normal,
}

@Entity('convention_item_comment')
export class ItemComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'convention_item_version_id'})
  itemVersionId!: number;

  @Column({name: 'parent_id'})
  parentId!: number;

  @Column({name: 'user_id'})
  userId!: number;

  @Column()
  content!: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt!: Date;

  @Column({name: 'deleted_at', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @Column()
  status!: ItemCommentStatus;
}
