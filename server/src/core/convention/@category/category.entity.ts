import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

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

  @Column()
  alias?: string;

  @Column()
  status!: number;
}
