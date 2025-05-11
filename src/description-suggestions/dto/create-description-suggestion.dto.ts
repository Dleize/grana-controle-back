import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDescriptionSuggestionDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}