import { AttackTypeService } from './attacktype.service';
export declare class AttackTypeController {
    private readonly attackTypeService;
    constructor(attackTypeService: AttackTypeService);
    getAttackTypes(): Promise<{
        type: string;
        count: number;
    }[]>;
}
