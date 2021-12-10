import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBillDto } from './dto/create-bill.dto';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentUser(accountId: string): any;
    createUser(data: Prisma.UserCreateInput): any;
    loginUser(data: Prisma.UserWhereUniqueInput & {
        signature: string;
    }): Promise<{
        userAccountId: any;
        name: any;
    }>;
    createStore(data: Prisma.StoreCreateWithoutSellerInput, userAccountId: string): Promise<any>;
    getAllStoresBySeller(userAccountId: string): Promise<any>;
    getAllStores(skip?: number, take?: number): Promise<any>;
    createBill(data: CreateBillDto['data'], userAccountId: string): Promise<any>;
    getBills(userAccountId: string): Promise<any>;
}
