export declare class FortiWebStatusService {
    private readonly API_URL;
    private readonly AUTH_TOKEN;
    getFortiWebStatus(): Promise<{
        cpu: number;
        memory: number;
        disk: number;
        tcp_concurrent_connection: number;
        status: number;
        throughput_in: number;
        throughput_out: number;
    }>;
}
