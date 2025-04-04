import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';

@Module({
  providers: [CountriesService],
  controllers: [CountriesController],
  exports: [CountriesService], // Permite que outros módulos utilizem esse serviço
})
export class CountriesModule {}
