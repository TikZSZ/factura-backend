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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getCurrentUser(accountId) {
        return this.prisma.user.findUnique({
            where: {
                userAccountId: accountId,
            },
            select: {
                name: true, userAccountId: true
            }
        });
    }
    createUser(data) {
        return this.prisma.user.create({
            data,
            select: {
                userAccountId: true,
                public_key: true,
                name: true,
            },
        });
    }
    async loginUser(data) {
        const user = await this.prisma.user.findUnique({
            where: {
                userAccountId: data.userAccountId,
            },
        });
        if (!user)
            throw new common_1.NotFoundException();
        if (!(user.signature === data.signature))
            throw new common_1.UnauthorizedException();
        return {
            userAccountId: user.userAccountId,
            name: user.name
        };
    }
    async createStore(data, userAccountId) {
        return this.prisma.store.create({
            data: Object.assign(Object.assign({}, data), { seller_id: userAccountId }),
        });
    }
    async getAllStoresBySeller(userAccountId) {
        return this.prisma.store.findMany({
            where: {
                seller_id: userAccountId,
            },
        });
    }
    async getAllStores(skip = 0, take = 10) {
        return this.prisma.store.findMany({
            skip, take, orderBy: {
                timeRegistred: 'desc'
            }
        });
    }
    async createBill(data, userAccountId) {
        const { buyerId, storeId, products, time, sequence_no, signature, timestamp, } = data;
        const sellerAccount = await this.prisma.store.findUnique({
            where: { store_id: storeId },
            select: {
                seller_id: true,
            },
        });
        if (!sellerAccount)
            throw new common_1.NotFoundException();
        if (!(sellerAccount.seller_id === userAccountId))
            throw new common_1.UnauthorizedException();
        return this.prisma.receiptRef.create({
            data: {
                time: time,
                buyer_id: buyerId,
                store_id: storeId,
                products: {
                    create: products,
                },
                sequence_no,
                signature,
                timestamp,
            },
            include: {
                products: true,
                buyer: {
                    select: {
                        name: true,
                        userAccountId: true,
                        public_key: true,
                    },
                },
                store: {
                    select: {
                        store_name: true,
                        website: true,
                        phone_number: true,
                        address: true,
                        seller: {
                            select: {
                                name: true,
                                userAccountId: true,
                                public_key: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getBills(userAccountId) {
        return this.prisma.user.findUnique({
            where: {
                userAccountId,
            },
            select: {
                receiptRefs: {
                    orderBy: {
                        receipt_id: 'desc'
                    },
                    include: {
                        products: true,
                        buyer: {
                            select: {
                                name: true,
                                userAccountId: true,
                                public_key: true,
                            },
                        },
                        store: {
                            select: {
                                store_name: true,
                                website: true,
                                phone_number: true,
                                address: true,
                                seller: {
                                    select: {
                                        name: true,
                                        userAccountId: true,
                                        public_key: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map