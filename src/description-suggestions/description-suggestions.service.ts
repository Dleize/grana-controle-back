import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DescriptionSuggestion } from './entities/description-suggestion.entity';
import { CreateDescriptionSuggestionDto } from './dto/create-description-suggestion.dto';

@Injectable()
export class DescriptionSuggestionsService {
  constructor(
    @InjectRepository(DescriptionSuggestion)
    private readonly repo: Repository<DescriptionSuggestion>,
  ) {}

  async create(dto: CreateDescriptionSuggestionDto) {
    const exists = await this.repo.findOneBy({ value: dto.value });
    if (exists) return exists;
    const suggestion = this.repo.create(dto);
    return this.repo.save(suggestion);
  }

  findAll() {
    return this.repo.find();
  }
}