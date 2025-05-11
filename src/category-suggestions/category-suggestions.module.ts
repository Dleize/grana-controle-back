import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySuggestion } from './entities/category-suggestion.entity';
import { CategorySuggestionsService } from './category-suggestions.service';
import { CategorySuggestionsController } from './category-suggestions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategorySuggestion])],
  controllers: [CategorySuggestionsController],
  providers: [CategorySuggestionsService],
  exports: [TypeOrmModule],
})

export class CategorySuggestionsModule {}
