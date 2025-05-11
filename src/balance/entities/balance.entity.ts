import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { default: 0 })
  totalIncome: number;

  @Column('decimal', { default: 0 })
  totalExpense: number;

  @Column('decimal', { default: 0 })
  currentBalance: number;

  @CreateDateColumn()
  updatedAt: Date;
}
