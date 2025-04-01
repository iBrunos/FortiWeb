// src/ph/ph.controller.ts

import { Controller, Get } from '@nestjs/common';
import { PhService } from './ph.service';

@Controller('ph')
export class PhController {
  constructor(private readonly phService: PhService) {}

  // Endpoint para retornar o valor calculado
  @Get('total')
  async getTotal(): Promise<{ total: number }> {
    const total = await this.phService.getTotalProtectedHostname();
    return { total };
  }
}
