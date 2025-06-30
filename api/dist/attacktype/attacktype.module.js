"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackTypeModule = void 0;
const common_1 = require("@nestjs/common");
const attacktype_service_1 = require("./attacktype.service");
const attacktype_controller_1 = require("./attacktype.controller");
let AttackTypeModule = class AttackTypeModule {
};
exports.AttackTypeModule = AttackTypeModule;
exports.AttackTypeModule = AttackTypeModule = __decorate([
    (0, common_1.Module)({
        providers: [attacktype_service_1.AttackTypeService],
        controllers: [attacktype_controller_1.AttackTypeController],
        exports: [attacktype_service_1.AttackTypeService],
    })
], AttackTypeModule);
//# sourceMappingURL=attacktype.module.js.map