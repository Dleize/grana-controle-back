import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CategorySuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  value: string;
}