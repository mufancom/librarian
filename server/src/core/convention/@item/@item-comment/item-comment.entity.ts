import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {User} from '../../../user';

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

  @CreateDateColumn({type: 'timestamp'})
  createdAt!: number;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt!: number;

  @Column({name: 'deleted_at'})
  deletedAt?: number;

  @Column()
  status!: ItemCommentStatus;
}
