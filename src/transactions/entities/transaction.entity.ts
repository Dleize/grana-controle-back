
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { DescriptionSuggestion } from '../../description-suggestions/entities/description-suggestion.entity';
import { CategorySuggestion } from '../../category-suggestions/entities/category-suggestion.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DescriptionSuggestion, { eager: true })
  description: DescriptionSuggestion;

  @ManyToOne(() => CategorySuggestion, { eager: true })
  category: CategorySuggestion;

  @Column()
  type: 'income' | 'expense';

  @Column()
  value: number;

  @Column()
  date: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column()
  month: number;

  @Column()
  year: number;

  @CreateDateColumn()
  createdAt: Date;
}