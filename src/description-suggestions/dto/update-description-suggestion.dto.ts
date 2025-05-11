import { PartialType } from '@nestjs/mapped-types';
import { CreateDescriptionSuggestionDto } from './create-description-suggestion.dto';

export class UpdateDescriptionSuggestionDto extends PartialType(CreateDescriptionSuggestionDto) {}
