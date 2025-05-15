import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CrpService } from './crp.service';

@Controller('crp')
export class CrpController {
  constructor(private readonly crpService: CrpService) {}

  // Rota para obter o total de Content Routing Policies (CRP)
  @Get('total')
  async getTotalContentRoutingPolicies() {
    try {
      // Obtemos os resultados do serviço
      const resultados = await this.crpService.getTotalContentRoutingPolicies();
      
      return { resultados };
    } catch (error) {
      throw new BadRequestException('Erro ao calcular o total de CRP');
    }
  }
}
