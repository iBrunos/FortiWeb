import { Module } from '@nestjs/common';
import { PhService } from './ph.service';
import { PhController } from './ph.controller';

@Module({
  providers: [PhService],
  controllers: [PhController],
  exports: [PhService], // Isso permite que outros módulos o usem
})
export class PhModule {}
