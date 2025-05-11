import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  BadRequestException,
  Query,
  Put,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  updateFull(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }


  @Get()
  findAll(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff > 31) {
        throw new BadRequestException('Intervalo máximo permitido é de 31 dias.');
      }
      return this.service.findByDateRange(startDate, endDate);
    }
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
