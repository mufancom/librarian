import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('convention_item_version')
export class ItemVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'convention_item_id'})
  conventionItemId!: number;

  @Column({name: 'from_id'})
  fromId!: number;

  @Column()
  content!: string;

  @Column()
  message?: string;

  @Column({name: 'comment_count'})
  commentCount!: number;

  @Column({name: 'thumb_up_count'})
  thumbUpCount!: number;

  @Column({name: 'created_at'})
  createdAt!: number;
}
