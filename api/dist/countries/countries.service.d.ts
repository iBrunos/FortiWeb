import { ConfigService } from '@nestjs/config';
export declare class CountriesService {
    private readonly configService;
    private readonly fortiwebs;
    private readonly httpsAgent;
    constructor(configService: ConfigService);
    private generateToken;
    private countryCodeMap;
    private fetchCountries;
    getThreatsByCountry(): Promise<{
        country: string;
        count: number;
        flag: string;
    }[]>;
}
