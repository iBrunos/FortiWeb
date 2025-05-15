import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CrpModule } from './crp/crp.module';
import { PhModule } from './ph/ph.module';
import { FortiWebStatusModule } from './fortiwebstatus/fortiwebstatus.module';
import { AttackTypeModule } from './attacktype/attacktype.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CrpModule,
    PhModule,
    FortiWebStatusModule,
    AttackTypeModule,
    CountriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}