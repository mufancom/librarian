import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export enum CategoryStatus {
  deleted,
  normal,
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'parent_id'})
  parentId!: number;

  @Column({name: 'order_id'})
  orderId!: number;

  @Column()
  title!: string;

  @Column({nullable: true})
  alias?: string;

  @Column({name: 'deleted_at', type: 'timestamp', nullable: true})
  deletedAt?: Date;

  @Column()
  status!: CategoryStatus;
}
