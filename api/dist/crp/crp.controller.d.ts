import { CrpService } from './crp.service';
export declare class CrpController {
    private readonly crpService;
    constructor(crpService: CrpService);
    getTotalContentRoutingPolicies(): Promise<{
        resultados: any;
    }>;
}
