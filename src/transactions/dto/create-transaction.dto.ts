import { IsUUID, IsIn, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  descriptionId: string;

  @IsUUID()
  categoryId: string;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  value: number;

  @IsString()
  date: string;

  @IsString()
  notes?: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}
