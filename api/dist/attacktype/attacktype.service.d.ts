export declare class AttackTypeService {
    private readonly API_URL;
    private readonly AUTH_TOKEN;
    getAttackTypes(): Promise<{
        type: string;
        count: number;
    }[]>;
}
