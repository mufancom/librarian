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

  @CreateDateColumn({type: 'integer'})
  createdAt!: number;

  @UpdateDateColumn({type: 'integer'})
  updatedAt!: number;

  @Column({name: 'deleted_at'})
  deletedAt?: number;

  @Column()
  status!: ItemCommentStatus;
}
