// src/crp/crp.module.ts

import { Module } from '@nestjs/common';
import { CrpService } from './crp.service';
import { CrpController } from './crp.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CrpService],
  controllers: [CrpController], // Adicionando o controller
})
export class CrpModule {}
