import { Test, TestingModule } from '@nestjs/testing';
import { DescriptionSuggestionsController } from './description-suggestions.controller';
import { DescriptionSuggestionsService } from './description-suggestions.service';

describe('DescriptionSuggestionsController', () => {
  let controller: DescriptionSuggestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DescriptionSuggestionsController],
      providers: [DescriptionSuggestionsService],
    }).compile();

    controller = module.get<DescriptionSuggestionsController>(DescriptionSuggestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
