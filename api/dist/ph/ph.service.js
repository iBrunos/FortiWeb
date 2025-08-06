"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const https = require("https");
let PhService = class PhService {
    constructor(configService) {
        this.configService = configService;
        this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
        this.fortiwebs = [1, 2, 3, 4]
            .map((index) => {
            var _a;
            const name = this.configService.get(`FORTIWEB${index}_NAME`);
            const baseUrl = this.configService.get(`FORTIWEB${index}_URL`);
            const username = this.configService.get(`FORTIWEB${index}_USER`);
            const password = this.configService.get(`FORTIWEB${index}_PASS`);
            const adoms = ((_a = this.configService.get(`FORTIWEB${index}_ADOMS`)) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
            if (name && baseUrl && username && password && adoms.length) {
                return { name, baseUrl, username, password, adoms };
            }
            return null;
        })
            .filter((f) => f !== null);
    }
    async generateToken(fortiweb, adom) {
        try {
            const credentials = {
                username: fortiweb.username,
                password: fortiweb.password,
                vdom: adom
            };
            const token = Buffer.from(JSON.stringify(credentials)).toString('base64');
            return token;
        }
        catch (error) {
            console.error(`Erro ao gerar token no FortiWeb ${fortiweb.name} [${adom}]`, error);
            return null;
        }
    }
    async getTotalProtectedHostnames() {
        const resultados = {
            fortiwebs: [],
        };
        for (const fw of this.fortiwebs) {
            const fortiwebResult = {
                name: fw.name,
                adoms: [],
                total: 0,
            };
            for (const adom of fw.adoms) {
                const token = await this.generateToken(fw, adom);
                if (!token) {
                    console.warn(`  ⚠️ Token não gerado para ${fw.name} [${adom}]`);
                    continue;
                }
                try {
                    const url = `${fw.baseUrl}/api/v2.0/cmdb/server-policy/allow-hosts`;
                    const response = await (0, node_fetch_1.default)(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                        agent: this.httpsAgent,
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    let adomTotal = 0;
                    if (data && Array.isArray(data.results)) {
                        data.results.forEach((item) => {
                            if (Array.isArray(item['sz_host-list'])) {
                                adomTotal += item['sz_host-list'].length;
                            }
                            else if (typeof item['sz_host-list'] === 'number') {
                                adomTotal += item['sz_host-list'];
                            }
                            else if (Array.isArray(item['host-list'])) {
                                adomTotal += item['host-list'].length;
                            }
                        });
                    }
                    else {
                        console.warn(`  ⚠️ Dados inesperados para ${fw.name} [${adom}]`, data);
                    }
                    fortiwebResult.adoms.push({
                        name: adom,
                        total: adomTotal,
                    });
                    fortiwebResult.total += adomTotal;
                }
                catch (error) {
                    console.error(`  ❌ Erro ao buscar Protected Hosts no FortiWeb ${fw.name} [${adom}]`, error);
                    fortiwebResult.adoms.push({
                        name: adom,
                        total: 0,
                        error: error.message,
                    });
                }
            }
            resultados.fortiwebs.push(fortiwebResult);
        }
        return resultados;
    }
};
exports.PhService = PhService;
exports.PhService = PhService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PhService);
//# sourceMappingURL=ph.service.js.map