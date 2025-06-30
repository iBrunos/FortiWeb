import { CountriesService } from './countries.service';
export declare class CountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
    getThreatByCountries(): Promise<{
        country: string;
        count: number;
    }[]>;
}
