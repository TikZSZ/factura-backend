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
exports.AuthController = void 0;
const sdk_1 = require("@hashgraph/sdk");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_bill_dto_1 = require("./dto/create-bill.dto");
const login_dto_1 = require("./dto/login.dto");
const jwt_1 = require("@nestjs/jwt");
const decorators_1 = require("./decorators");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async createUser(body, req) {
        const isCorrect = sdk_1.PublicKey.fromString(body.data.public_key).verify(Buffer.from("bills"), Buffer.from(body.data.signature, "hex"));
        if (!isCorrect)
            throw new common_1.BadRequestException();
        const createdUser = await this.authService.createUser(body.data);
        const token = this.jwtService.sign({ userAccountId: createdUser.userAccountId, name: createdUser.name });
        req.session['user'] = token;
        return createdUser;
    }
    async loginUser(body, req) {
        const foundUser = await this.authService.loginUser(body.data);
        const token = this.jwtService.sign(foundUser);
        req.session['user'] = token;
        return foundUser;
    }
    createStore(body, user) {
        return this.authService.createStore(body.data, user.userAccountId);
    }
    getAllStoresBySeller(userAccountId) {
        return this.authService.getAllStoresBySeller(userAccountId);
    }
    getAllStores() {
        return this.authService.getAllStores();
    }
    createBill(body, user) {
        console.log(body.data);
        return this.authService.createBill(body.data, user.userAccountId);
    }
    getBills(user) {
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.authService.getBills(user.userAccountId);
    }
    getCurrentUser(user) {
        if (!user) {
            throw new common_1.NotFoundException();
        }
        return this.authService.getCurrentUser(user.userAccountId);
    }
    logOut(req) {
        req.session['user'] = null;
        return;
    }
};
__decorate([
    (0, common_1.Post)('/createUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('/loginUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('/createStore'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createStore", null);
__decorate([
    (0, common_1.Get)('/getAllStoresBySeller/:userAccountId'),
    __param(0, (0, common_1.Param)('userAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAllStoresBySeller", null);
__decorate([
    (0, common_1.Get)('/getAllStores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAllStores", null);
__decorate([
    (0, common_1.Post)('/createBill'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bill_dto_1.CreateBillDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createBill", null);
__decorate([
    (0, common_1.Get)('/getBills'),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getBills", null);
__decorate([
    (0, common_1.Get)("/currentUser"),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)("/logout"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logOut", null);
AuthController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, jwt_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map