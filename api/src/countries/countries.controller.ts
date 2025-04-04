import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('list')
  async getThreatByCountries(): Promise<{ country: string; count: number }[]> {
    return await this.countriesService.getThreatsByCountry();
  }
}