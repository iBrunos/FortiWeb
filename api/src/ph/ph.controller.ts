// src/ph/ph.controller.ts

import { Controller, Get, BadRequestException } from '@nestjs/common';
import { PhService } from './ph.service';

@Controller('ph')
export class PhController {
  constructor(private readonly phService: PhService) {}

  // Rota para obter o total de Protected Hostnames (PH)
  @Get('total')
  async getTotalProtectedHostnames() {
    try {
      const resultados = await this.phService.getTotalProtectedHostnames();
      return { resultados };
    } catch (error) {
      throw new BadRequestException('Erro ao calcular o total de PH');
    }
  }
}
