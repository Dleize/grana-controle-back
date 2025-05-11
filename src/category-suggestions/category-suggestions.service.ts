import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorySuggestion } from './entities/category-suggestion.entity';
import { CreateCategorySuggestionDto } from './dto/create-category-suggestion.dto';

@Injectable()
export class CategorySuggestionsService {
  constructor(
    @InjectRepository(CategorySuggestion)
    private readonly repo: Repository<CategorySuggestion>,
  ) {}

  async create(dto: CreateCategorySuggestionDto) {
    const exists = await this.repo.findOneBy({ value: dto.value });
    if (exists) return exists;
    const suggestion = this.repo.create(dto);
    return this.repo.save(suggestion);
  }

  findAll() {
    return this.repo.find();
  }
}