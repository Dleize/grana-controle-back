import { Test, TestingModule } from '@nestjs/testing';
import { DescriptionSuggestionsService } from './description-suggestions.service';

describe('DescriptionSuggestionsService', () => {
  let service: DescriptionSuggestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DescriptionSuggestionsService],
    }).compile();

    service = module.get<DescriptionSuggestionsService>(DescriptionSuggestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
