export declare class CountriesService {
    private readonly API_URL;
    private readonly AUTH_TOKEN;
    private countryCodeMap;
    getThreatsByCountry(): Promise<{
        country: string;
        count: number;
        flag: string;
    }[]>;
}
