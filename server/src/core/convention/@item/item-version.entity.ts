import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('convention_item_version')
export class ItemVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'convention_item_id'})
  conventionItemId!: number;

  @Column({name: 'from_id'})
  fromId!: number;

  @Column({name: 'user_id'})
  userId!: number;

  @Column({type: 'longtext'})
  content!: string;

  @Column({nullable: true})
  message?: string;

  @Column()
  hash!: string;

  @Column({name: 'comment_count'})
  commentCount!: number;

  @Column({name: 'thumb_up_count'})
  thumbUpCount!: number;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;
}
