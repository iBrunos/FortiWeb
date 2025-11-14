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
exports.AttackTypeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const https = require("https");
let AttackTypeService = class AttackTypeService {
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
            const adoms = ((_a = this.configService
                .get(`FORTIWEB${index}_ADOMS`)) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
            if (name && baseUrl && username && password && adoms.length > 0) {
                return { name, baseUrl, username, password, adoms };
            }
            return null;
        })
            .filter((f) => f !== null);
    }
    generateToken(fortiweb, adom) {
        const creds = {
            username: fortiweb.username,
            password: fortiweb.password,
            vdom: adom,
        };
        return Buffer.from(JSON.stringify(creds)).toString('base64');
    }
    async fetchAttackTypes(fortiweb, adom) {
        var _a, _b;
        const token = this.generateToken(fortiweb, adom);
        const url = `${fortiweb.baseUrl}/api/v2.0/system/status.monitor?vdom=${adom}`;
        try {
            const response = await (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                agent: this.httpsAgent,
            });
            if (!response.ok) {
                console.error(`❌ Erro no FortiWeb ${fortiweb.name} [${adom}]: ${response.status}`);
                return [];
            }
            const body = await response.json();
            const list = (_b = (_a = body === null || body === void 0 ? void 0 : body.results) === null || _a === void 0 ? void 0 : _a.threat_by_attack_type) !== null && _b !== void 0 ? _b : [];
            return list.map((item) => ({
                type: item.type || 'Desconhecido',
                count: parseInt(item.count, 10) || 0,
            }));
        }
        catch (error) {
            console.error(`❌ Erro ao buscar ADOM ${adom} no ${fortiweb.name}:`, error);
            return [];
        }
    }
    async getAttackTypes() {
        const aggregated = {};
        for (const fw of this.fortiwebs) {
            for (const adom of fw.adoms) {
                const attacks = await this.fetchAttackTypes(fw, adom);
                for (const item of attacks) {
                    if (!aggregated[item.type])
                        aggregated[item.type] = 0;
                    aggregated[item.type] += item.count;
                }
            }
        }
        return Object.entries(aggregated).map(([type, count]) => ({
            type,
            count,
        }));
    }
};
exports.AttackTypeService = AttackTypeService;
exports.AttackTypeService = AttackTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AttackTypeService);
//# sourceMappingURL=attacktype.service.js.map