import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategorySuggestionDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}