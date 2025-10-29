import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CrpService } from './crp.service';

@Controller('crp')
export class CrpController {
  constructor(private readonly crpService: CrpService) {}

  // Rota para obter o total de Content Routing Policies (CRP)
  @Get('total')
  async getTotalContentRoutingPolicies() {
    try {
      const resultados = await this.crpService.getTotalContentRoutingPolicies();
      return { resultados };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao calcular o total de CRP');
    }
  }

  // Nova rota: obter CRPs de uma ADOM específica
  @Get()
  async getCrpsByAdom(@Query('adom') adom: string) {
    if (!adom) {
      throw new BadRequestException('Parâmetro "adom" é obrigatório');
    }

    try {
      const crps = await this.crpService.getCrpsByAdom(adom);
      return { results: crps };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`Erro ao buscar CRPs da ADOM "${adom}"`);
    }
  }
}
