import { Controller, Get, Query } from '@nestjs/common';
import { CrpService } from './crp.service';

@Controller('crp')
export class CrpController {
  constructor(private readonly crpService: CrpService) {}

  @Get('total')
  getTotalContentRoutingPolicies() {
    return this.crpService.getTotalContentRoutingPolicies();
  }

  @Get('expressions')
  getContentRoutingExpressions(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
      throw new Error('Parâmetros "page" e "limit" são obrigatórios e devem ser números.');
    }

    return this.crpService.getContentRoutingExpressions(parsedPage, parsedLimit);
  }
}
