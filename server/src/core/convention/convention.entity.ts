import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export enum ConventionStatus {
  deleted,
  normal,
}

@Entity()
export class Convention {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'category_id'})
  categoryId!: number;

  @Column({name: 'order_id'})
  orderId!: number;

  @Column()
  title!: string;

  @Column()
  alias?: string;

  @Column({name: 'created_at'})
  createdAt!: number;

  @Column({name: 'deleted_at'})
  deletedAt?: number;

  @Column()
  status!: ConventionStatus;
}
