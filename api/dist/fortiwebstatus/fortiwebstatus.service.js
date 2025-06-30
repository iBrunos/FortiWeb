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
        this.API_URL = 'https://172.30.1.254/api/v2.0/system/status.monitor';
        this.AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1IiwidmRvbSI6InJvb3QifQo=";
    }
    async getFortiWebStatus() {
        try {
            const response = await (0, node_fetch_1.default)(this.API_URL, {
                method: 'GET',
                headers: {
                    Authorization: this.AUTH_TOKEN,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                agent: new https.Agent({
                    rejectUnauthorized: false,
                }),
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.status}`);
            }
            const body = await response.json();
            if (body.results) {
                return {
                    cpu: body.results.cpu || 0,
                    memory: body.results.memory || 0,
                    disk: body.results.log_disk || 0,
                    tcp_concurrent_connection: body.results.tcp_concurrent_connection || 0,
                    status: body.results.status || 0,
                    throughput_in: body.results.throughput_in || 0,
                    throughput_out: body.results.throughput_out || 0
                };
            }
            throw new Error('A resposta da API não contém os dados esperados.');
        }
        catch (error) {
            throw new Error(`Erro ao fazer a requisição: ${error.message}`);
        }
    }
};
exports.FortiWebStatusService = FortiWebStatusService;
exports.FortiWebStatusService = FortiWebStatusService = __decorate([
    (0, common_1.Injectable)()
], FortiWebStatusService);
//# sourceMappingURL=fortiwebstatus.service.js.map