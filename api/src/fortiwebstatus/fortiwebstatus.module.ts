import { Module } from '@nestjs/common';
import { FortiWebStatusService } from './fortiwebstatus.service';
import { FortiWebStatusController } from './fortiwebstatus.controller';

@Module({
  providers: [FortiWebStatusService],
  controllers: [FortiWebStatusController],
  exports: [FortiWebStatusService], // Isso permite que outros módulos o usem
})
export class FortiWebStatusModule {}