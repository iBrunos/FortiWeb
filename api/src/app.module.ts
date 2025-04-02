import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CrpModule } from './crp/crp.module'; // Importe corretamente o módulo Crp
import { PhModule } from './ph/ph.module'; // Importe corretamente o módulo ph
import { FortiWebStatusModule } from './fortiwebstatus/fortiwebstatus.module'; // Importe corretamente o módulo Crp


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CrpModule, // Aqui você importa o CrpModule corretamente
    PhModule,
    FortiWebStatusModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
