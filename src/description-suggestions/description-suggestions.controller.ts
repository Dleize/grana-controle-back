import { Controller, Get, Post, Body } from '@nestjs/common';
import { DescriptionSuggestionsService } from './description-suggestions.service';
import { CreateDescriptionSuggestionDto } from './dto/create-description-suggestion.dto';

@Controller('description-suggestions')
export class DescriptionSuggestionsController {
  constructor(private readonly service: DescriptionSuggestionsService) {}

  @Post()
  create(@Body() dto: CreateDescriptionSuggestionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}