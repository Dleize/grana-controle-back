import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async generateReport({
    month,
    year,
    start,
    end,
  }: {
    month?: number;
    year?: number;
    start?: Date;
    end?: Date;
  }) {
    const all = await this.transactionRepo.find();

    let filtered: Transaction[] = [];
    let useDaily = false;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays > 366) {
        throw new Error("Intervalo máximo permitido é de 1 ano.");
      }

      filtered = all.filter((t) => {
        const d = new Date(t.date);
        return d >= startDate && d <= endDate;
      });

      useDaily = diffDays <= 30;
    }

    else if (month && year) {
      filtered = all.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      useDaily = true;
    }

    else if (year) {
      filtered = all.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year;
      });

      useDaily = false;
    }

    else {
      throw new Error("Parâmetros inválidos para relatório.");
    }

    return {
      totalIncome: this.sumByType(filtered, 'income'),
      totalExpense: this.sumByType(filtered, 'expense'),
      currentBalance:
        this.sumByType(filtered, 'income') - this.sumByType(filtered, 'expense'),
      movementsByPeriod: useDaily
        ? this.sumByDay(filtered)
        : this.sumByMonth(filtered),
      byCategory: {
        income: this.sumByCategory(filtered, 'income'),
        expense: this.sumByCategory(filtered, 'expense'),
      },
      recurringExpenses: this.getUniqueRecurringExpenses(filtered),
    };
  }


  private sumByType(transactions: Transaction[], type: 'income' | 'expense') {
    return transactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + t.value, 0);
  }

  private sumByCategory(transactions: Transaction[], type: 'income' | 'expense') {
    const grouped = new Map<string, { id: string; label: string; total: number }>();
    for (const t of transactions) {
      if (t.type !== type) continue;
      const id = typeof t.category === 'object' ? t.category?.id : '';
      const label = typeof t.category === 'object' ? t.category?.value : t.category;
      const key = id || label || 'Desconhecido';

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: id || key,
          label: label || 'Desconhecido',
          total: 0,
        });
      }

      grouped.get(key)!.total += t.value;
    }

    return Array.from(grouped.values());
  }

  private sumByDay(transactions: Transaction[]) {
    const days = new Map<number, { income: number; expense: number }>();
    for (const t of transactions) {
      const day = new Date(t.date).getDate();
      if (!days.has(day)) days.set(day, { income: 0, expense: 0 });
      days.get(day)![t.type] += t.value;
    }
    return Array.from(days, ([day, totals]) => ({
      label: `Dia ${day}`,
      ...totals,
    }));
  }

  private sumByMonth(transactions: Transaction[]) {
    const months = new Map<number, { income: number; expense: number }>();
    for (const t of transactions) {
      const month = new Date(t.date).getMonth() + 1;
      if (!months.has(month)) months.set(month, { income: 0, expense: 0 });
      months.get(month)![t.type] += t.value;
    }

    const nomesMeses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];

    return Array.from(months, ([month, totals]) => ({
      label: nomesMeses[month - 1] || `M${month}`,
      ...totals,
    }));
  }

  private getUniqueRecurringExpenses(transactions: Transaction[]) {
    const seen = new Set<string>();
    const filtered: Transaction[] = [];

    for (const t of transactions) {
      if (
        t.type === 'expense' &&
        t.isRecurring &&
        t.description &&
        typeof t.description === 'object' &&
        !seen.has(t.description.id)
      ) {
        seen.add(t.description.id);
        filtered.push(t);
      }
    }

    return filtered;
  }
}
