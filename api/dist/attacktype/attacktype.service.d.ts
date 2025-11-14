import { ConfigService } from '@nestjs/config';
export declare class AttackTypeService {
    private readonly configService;
    private readonly fortiwebs;
    private readonly httpsAgent;
    constructor(configService: ConfigService);
    private generateToken;
    private fetchAttackTypes;
    getAttackTypes(): Promise<{
        type: string;
        count: number;
    }[]>;
}
