// src/crp/crp.controller.ts

import { Controller, Get } from '@nestjs/common';
import { CrpService } from './crp.service';

@Controller('crp')
export class CrpController {
  constructor(private readonly crpService: CrpService) {}

  // Endpoint para retornar o valor calculado
  @Get('total')
  async getTotal(): Promise<{ total: number }> {
    const total = await this.crpService.getTotalContentRoutingPolicies();
    return { total };
  }
}
