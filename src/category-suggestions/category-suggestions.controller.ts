import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategorySuggestionsService } from './category-suggestions.service';
import { CreateCategorySuggestionDto } from './dto/create-category-suggestion.dto';

@Controller('category-suggestions')
export class CategorySuggestionsController {
  constructor(private readonly service: CategorySuggestionsService) {}

  @Post()
  create(@Body() dto: CreateCategorySuggestionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}