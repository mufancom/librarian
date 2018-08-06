import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({name: 'parent_id'})
  parentId!: number;

  @Column({name: 'file_path'})
  filePath!: string;

  @Column({name: 'user_id'})
  userId!: number;

  @Column()
  content!: string;

  @Column({name: 'created_at'})
  createdAt!: number;

  @Column({name: 'updated_at'})
  updatedAt!: number;
}
