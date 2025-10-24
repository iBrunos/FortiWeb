import { FortiWebStatusService } from './fortiwebstatus.service';
export declare class FortiWebStatusController {
    private readonly fortiWebStatusService;
    constructor(fortiWebStatusService: FortiWebStatusService);
    getStatus(): Promise<Record<string, {
        cpu: number;
        memory: number;
        disk: number;
        tcp_concurrent_connection: number;
        status: number;
        throughput_in: number;
        throughput_out: number;
    }>>;
}
