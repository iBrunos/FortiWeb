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
exports.PhController = void 0;
const common_1 = require("@nestjs/common");
const ph_service_1 = require("./ph.service");
let PhController = class PhController {
    constructor(phService) {
        this.phService = phService;
    }
    async getTotalProtectedHostnames() {
        try {
            const resultados = await this.phService.getTotalProtectedHostnames();
            return { resultados };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao calcular o total de PH');
        }
    }
};
exports.PhController = PhController;
__decorate([
    (0, common_1.Get)('total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhController.prototype, "getTotalProtectedHostnames", null);
exports.PhController = PhController = __decorate([
    (0, common_1.Controller)('ph'),
    __metadata("design:paramtypes", [ph_service_1.PhService])
], PhController);
//# sourceMappingURL=ph.controller.js.map