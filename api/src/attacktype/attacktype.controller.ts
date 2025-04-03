import { Controller, Get } from '@nestjs/common';
import { AttackTypeService } from './attacktype.service';

@Controller('attacktype')
export class AttackTypeController {
  constructor(private readonly attackTypeService: AttackTypeService) {}

  @Get('list')
  async getAttackTypes(): Promise<{ type: string; count: number }[]> {
    return await this.attackTypeService.getAttackTypes();
  }
}
