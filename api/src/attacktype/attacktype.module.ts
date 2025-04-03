import { Module } from '@nestjs/common';
import { AttackTypeService } from './attacktype.service';
import { AttackTypeController } from './attacktype.controller';

@Module({
  providers: [AttackTypeService],
  controllers: [AttackTypeController],
  exports: [AttackTypeService], // Permite que outros módulos utilizem esse serviço
})
export class AttackTypeModule {}
