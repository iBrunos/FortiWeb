import { Controller, Get } from '@nestjs/common';
import { FortiWebStatusService } from './fortiwebstatus.service';

@Controller('fortiwebstatus')
export class FortiWebStatusController {
  constructor(private readonly fortiWebStatusService: FortiWebStatusService) {}

  // Endpoint para retornar o status do FortiWeb
  @Get('status')
  async getStatus(): Promise<{ cpu: number; memory: number; disk: number; tcp_concurrent_connection: number; status: number; throughput_in: number; throughput_out: number }> {
    return await this.fortiWebStatusService.getFortiWebStatus();
  }
}