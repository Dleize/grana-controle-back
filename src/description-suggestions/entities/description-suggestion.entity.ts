import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class DescriptionSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  value: string;
}