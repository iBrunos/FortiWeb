interface FortiWebStatus {
    cpu: number;
    memory: number;
    disk: number;
    tcp_concurrent_connection: number;
    status: number;
    throughput_in: number;
    throughput_out: number;
}
export declare class FortiWebStatusService {
    private readonly fortiwebs;
    getFortiWebStatus(): Promise<Record<string, FortiWebStatus>>;
}
export {};
