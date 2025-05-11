import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class CreateBalanceDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  totalIncome: number;

  @Column({ type: 'int', default: 0 })
  totalExpense: number;

  @Column({ type: 'int', default: 0 })
  currentBalance: number;

  @CreateDateColumn()
  updatedAt: Date;
}
