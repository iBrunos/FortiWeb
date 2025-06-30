import { PhService } from './ph.service';
export declare class PhController {
    private readonly phService;
    constructor(phService: PhService);
    getTotalProtectedHostnames(): Promise<{
        resultados: any;
    }>;
}
