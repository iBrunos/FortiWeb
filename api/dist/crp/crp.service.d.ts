import { ConfigService } from '@nestjs/config';
interface FortiwebAdomConfig {
    name: string;
    baseUrl: string;
    username: string;
    password: string;
    adoms: string[];
}
export declare class CrpService {
    private readonly configService;
    private readonly fortiwebs;
    private readonly httpsAgent;
    constructor(configService: ConfigService);
    generateToken(fortiweb: FortiwebAdomConfig, adom: string): Promise<string | null>;
    getTotalContentRoutingPolicies(): Promise<any>;
    getCrpsByAdom(adom: string): Promise<any>;
}
export {};
