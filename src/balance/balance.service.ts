import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './entities/balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepo: Repository<Balance>,
  ) {}

  async findOne() {
    let balance = await this.balanceRepo.findOneBy({ id: 1 });

    if (!balance) {
      balance = this.balanceRepo.create({
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: 0,
      });
      balance = await this.balanceRepo.save(balance);
    }

    return balance;
  }
}
