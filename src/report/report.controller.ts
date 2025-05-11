import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport(
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    if (start && end) {
      return this.reportService.generateReport({
        start: new Date(start),
        end: new Date(end),
      });
    }
    
    if (year) {
      return this.reportService.generateReport({
        year: Number(year),
        month: month ? Number(month) : undefined,
      });
    }

    throw new BadRequestException('Parâmetros inválidos. Informe year, ou start e end.');
  }
}
