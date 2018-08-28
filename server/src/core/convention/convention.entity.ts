import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ConventionStatus {
  deleted,
  normal,
}

@Entity()
@Index(['title', 'alias'], {fulltext: true})
export class Convention {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'category_id'})
  categoryId!: number;

  @Column({name: 'order_id'})
  orderId!: number;

  @Column()
  title!: string;

  @Column({nullable: true})
  alias?: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @Column({name: 'deleted_at', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @Column()
  status!: ConventionStatus;
}
