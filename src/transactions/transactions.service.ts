import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Balance } from '../balance/entities/balance.entity';
import { DescriptionSuggestion } from '../description-suggestions/entities/description-suggestion.entity';
import { CategorySuggestion } from '../category-suggestions/entities/category-suggestion.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Balance)
    private readonly balanceRepo: Repository<Balance>,

    @InjectRepository(DescriptionSuggestion)
    private readonly descRepo: Repository<DescriptionSuggestion>,

    @InjectRepository(CategorySuggestion)
    private readonly catRepo: Repository<CategorySuggestion>,
  ) {}

  async create(dto: CreateTransactionDto) {
    const description = await this.descRepo.findOneBy({ id: dto.descriptionId });
    const category = await this.catRepo.findOneBy({ id: dto.categoryId });

    if (!description || !category) {
      throw new Error('Descrição ou categoria inválida');
    }

    const transaction = this.transactionRepo.create({
      type: dto.type,
      value: dto.value,
      date: dto.date,
      notes: dto.notes,
      isRecurring: dto.isRecurring ?? false,
      month: dto.month,
      year: dto.year,
      description,
      category,
    });

    const saved = await this.transactionRepo.save(transaction);

    await this.adjustBalance(dto.type, dto.value);
    return saved;
  }

  findAll() {
    return this.transactionRepo.find({ order: { date: 'DESC' } });
  }

  findOne(id: string) {
    return this.transactionRepo.findOneBy({ id });
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const existing = await this.transactionRepo.findOne({
      where: { id },
      relations: ['description', 'category'],
    });
    if (!existing) return null;

    const description =
      (dto.descriptionId && await this.descRepo.findOneBy({ id: dto.descriptionId })) ||
      (dto.description && await this.descRepo.findOneBy({ value: dto.description })) ||
      (dto.description && await this.descRepo.save(this.descRepo.create({ value: dto.description })));

    const category =
      (dto.categoryId && await this.catRepo.findOneBy({ id: dto.categoryId })) ||
      (dto.category && await this.catRepo.findOneBy({ value: dto.category })) ||
      (dto.category && await this.catRepo.save(this.catRepo.create({ value: dto.category })));

    if (!description || !category) {
      throw new Error('Descrição ou categoria inválida');
    }

    await this.adjustBalance(existing.type, -existing.value);
    await this.adjustBalance(dto.type ?? existing.type, dto.value ?? existing.value);

    existing.type = dto.type ?? existing.type;
    existing.value = dto.value ?? existing.value;
    existing.date = dto.date ?? existing.date;
    existing.notes = dto.notes ?? existing.notes;
    existing.isRecurring = dto.isRecurring ?? existing.isRecurring;
    existing.month = dto.month ?? new Date(existing.date).getMonth() + 1;
    existing.year = dto.year ?? new Date(existing.date).getFullYear();
    existing.description = description;
    existing.category = category;

    await this.transactionRepo.save(existing);
    return existing;
  }

  async remove(id: string) {
    const existing = await this.transactionRepo.findOneBy({ id });
    if (!existing) return null;

    await this.transactionRepo.delete(id);
    await this.adjustBalance(existing.type, -existing.value);

    return { deleted: true };
  }

  private async adjustBalance(type: 'income' | 'expense', value: number) {
    let balance = await this.balanceRepo.findOneBy({ id: 1 });

    if (!balance) {
      balance = this.balanceRepo.create({
        id: 1,
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: 0,
      });
    }

    balance.totalIncome = parseFloat(balance.totalIncome as any);
    balance.totalExpense = parseFloat(balance.totalExpense as any);

    if (type === 'income') {
      balance.totalIncome += value;
    } else {
      balance.totalExpense += value;
    }

    balance.currentBalance = balance.totalIncome - balance.totalExpense;

    await this.balanceRepo.save(balance);
  }

  async findByDateRange(start: Date, end: Date) {
    return this.transactionRepo.find({
      where: {
        date: Between(start.toISOString(), end.toISOString()),
      },
      relations: ['description', 'category'],
      order: { date: 'DESC' },
    });
  }
}
