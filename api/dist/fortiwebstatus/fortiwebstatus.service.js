"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortiWebStatusService = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
const https = require("https");
let FortiWebStatusService = class FortiWebStatusService {
    constructor() {
        this.fortiwebs = [
            {
                name: 'WAF01',
                url: 'https://172.30.1.254/api/v2.0/system/status.monitor',
                token: 'eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1NiIsInZkb20iOiJyb290In0K',
            },
            {
                name: 'WAF02',
                url: 'https://10.201.131.2/api/v2.0/system/status.monitor',
                token: 'eyJ1c2VybmFtZSI6ImFwaTIiLCJwYXNzd29yZCI6IkFwaTEyMzQ1QCIsInZkb20iOiJTRUlORlJBIn0=',
            },
        ];
    }
    async getFortiWebStatus() {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const results = {};
        for (const fw of this.fortiwebs) {
            try {
                const response = await (0, node_fetch_1.default)(fw.url, {
                    method: 'GET',
                    headers: {
                        Authorization: fw.token,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    agent,
                });
                if (!response.ok) {
                    throw new Error(`${fw.name} retornou erro HTTP ${response.status}`);
                }
                const body = await response.json();
                if (body.results) {
                    results[fw.name] = {
                        cpu: body.results.cpu || 0,
                        memory: body.results.memory || 0,
                        disk: body.results.log_disk || 0,
                        tcp_concurrent_connection: body.results.tcp_concurrent_connection || 0,
                        status: body.results.status || 0,
                        throughput_in: body.results.throughput_in || 0,
                        throughput_out: body.results.throughput_out || 0,
                    };
                }
                else {
                    console.error(`${fw.name} - Resposta sem "results".`);
                    results[fw.name] = {
                        cpu: 0,
                        memory: 0,
                        disk: 0,
                        tcp_concurrent_connection: 0,
                        status: 0,
                        throughput_in: 0,
                        throughput_out: 0,
                    };
                }
            }
            catch (error) {
                console.error(`Erro ao consultar ${fw.name}:`, error.message);
                results[fw.name] = {
                    cpu: 0,
                    memory: 0,
                    disk: 0,
                    tcp_concurrent_connection: 0,
                    status: 0,
                    throughput_in: 0,
                    throughput_out: 0,
                };
            }
        }
        return results;
    }
};
exports.FortiWebStatusService = FortiWebStatusService;
exports.FortiWebStatusService = FortiWebStatusService = __decorate([
    (0, common_1.Injectable)()
], FortiWebStatusService);
//# sourceMappingURL=fortiwebstatus.service.js.map