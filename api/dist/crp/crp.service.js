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
exports.CrpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const https = require("https");
let CrpService = class CrpService {
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
    async getTotalContentRoutingPolicies() {
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
                    const url = `${fw.baseUrl}/api/v2.0/cmdb/server-policy/http-content-routing-policy`;
                    const response = await (0, node_fetch_1.default)(url, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', Authorization: token },
                        agent: this.httpsAgent,
                    });
                    const data = await response.json();
                    let adomTotal = 0;
                    if (data && Array.isArray(data.results)) {
                        data.results.forEach((item) => {
                            let count = 0;
                            if (Array.isArray(item['sz_content-routing-match-list'])) {
                                count = item['sz_content-routing-match-list'].length;
                            }
                            else if (typeof item['sz_content-routing-match-list'] === 'number') {
                                count = item['sz_content-routing-match-list'];
                            }
                            else if (Array.isArray(item['content-routing-match-list'])) {
                                count = item['content-routing-match-list'].length;
                            }
                            adomTotal += count;
                        });
                    }
                    else {
                        console.warn(`  ⚠️ Dados inesperados para ${fw.name} [${adom}]`, data);
                    }
                    fortiwebResult.adoms.push({ name: adom, total: adomTotal });
                    fortiwebResult.total += adomTotal;
                }
                catch (error) {
                    console.error(`  ❌ Erro ao buscar CRPs no FortiWeb ${fw.name} [${adom}]`, error);
                    fortiwebResult.adoms.push({ name: adom, total: 0, error: error.message });
                }
            }
            resultados.fortiwebs.push(fortiwebResult);
        }
        return resultados;
    }
    async getCrpsByAdom(adom) {
        let username = '';
        let password = '';
        if (['LIMPURB', 'SMS', 'SEGOV', 'SEMIT', 'CASACIVIL', 'SECOM', 'SEMGE', 'PGMS', 'SEFAZ', 'SEDUR', 'SECIS', 'SECULT', 'SEMDEC', 'CGM', 'SEMUR', 'SPMJ'].includes(adom)) {
            username = this.configService.get('FORTIWEB2_USER');
            password = this.configService.get('FORTIWEB2_PASS');
        }
        else if (['SEINFRA', 'SEMAN', 'SEMOP', 'SEMOB', 'TRANSALVADO', 'SEMPRE', 'SMED', 'FMLF', 'FGM', 'FCM', 'DESAL', 'GCMS', 'SALTUR', 'PMLF'].includes(adom)) {
            username = this.configService.get('FORTIWEB3_USER');
            password = this.configService.get('FORTIWEB3_PASS');
        }
        else if (['COGEL', 'SACPB'].includes(adom)) {
            username = this.configService.get('FORTIWEB4_USER');
            password = this.configService.get('FORTIWEB4_PASS');
        }
        else {
            throw new Error(`ADOM "${adom}" não reconhecida`);
        }
        const fwUrl = this.configService.get('FORTIWEB2_URL');
        const token = Buffer.from(JSON.stringify({ username, password, vdom: adom })).toString('base64');
        const response = await (0, node_fetch_1.default)(`${fwUrl}/api/v2.0/cmdb/server-policy/http-content-routing-policy`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            agent: this.httpsAgent,
        });
        let data;
        try {
            data = await response.json();
        }
        catch (_a) {
            data = { results: [] };
        }
        return Array.isArray(data.results)
            ? data.results.map((item) => ({
                crp: item.name ? item.name.replace(/^CRP_/, '') + '.salvador.ba.gov.br' : '',
                server: item["server-pool"] || '',
            }))
            : [];
    }
};
exports.CrpService = CrpService;
exports.CrpService = CrpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CrpService);
//# sourceMappingURL=crp.service.js.map