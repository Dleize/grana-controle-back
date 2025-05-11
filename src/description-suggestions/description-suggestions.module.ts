import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DescriptionSuggestionsService } from './description-suggestions.service';
import { DescriptionSuggestionsController } from './description-suggestions.controller';
import { DescriptionSuggestion } from './entities/description-suggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DescriptionSuggestion])],
  controllers: [DescriptionSuggestionsController],
  providers: [DescriptionSuggestionsService],
  exports: [TypeOrmModule], 
})
export class DescriptionSuggestionsModule {}
