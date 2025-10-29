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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrpController = void 0;
const common_1 = require("@nestjs/common");
const crp_service_1 = require("./crp.service");
let CrpController = class CrpController {
    constructor(crpService) {
        this.crpService = crpService;
    }
    async getTotalContentRoutingPolicies() {
        try {
            const resultados = await this.crpService.getTotalContentRoutingPolicies();
            return { resultados };
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('Erro ao calcular o total de CRP');
        }
    }
    async getCrpsByAdom(adom) {
        if (!adom) {
            throw new common_1.BadRequestException('Parâmetro "adom" é obrigatório');
        }
        try {
            const crps = await this.crpService.getCrpsByAdom(adom);
            return { results: crps };
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException(`Erro ao buscar CRPs da ADOM "${adom}"`);
        }
    }
};
exports.CrpController = CrpController;
__decorate([
    (0, common_1.Get)('total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrpController.prototype, "getTotalContentRoutingPolicies", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('adom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrpController.prototype, "getCrpsByAdom", null);
exports.CrpController = CrpController = __decorate([
    (0, common_1.Controller)('crp'),
    __metadata("design:paramtypes", [crp_service_1.CrpService])
], CrpController);
//# sourceMappingURL=crp.controller.js.map