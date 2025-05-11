import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { BalanceModule } from '../balance/balance.module'; 
import { DescriptionSuggestionsModule } from 'src/description-suggestions/description-suggestions.module';
import { CategorySuggestionsModule } from 'src/category-suggestions/category-suggestions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BalanceModule,
    DescriptionSuggestionsModule,
    CategorySuggestionsModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
