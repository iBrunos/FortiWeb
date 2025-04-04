import { Controller, Get } from '@nestjs/common';
import { CrpService } from './crp.service';

@Controller('crp')
export class CrpController {
  constructor(private readonly crpService: CrpService) {}

  @Get('total')
  getTotalContentRoutingPolicies() {
    return this.crpService.getTotalContentRoutingPolicies();
  }

  // 🔽 Nova rota para listar os match-expressions de cada CRP
  @Get('expressions')
  getContentRoutingExpressions() {
    return this.crpService.getContentRoutingExpressions();
  }
}
