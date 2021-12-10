import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBillDto } from './dto/create-bill.dto';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentUser(accountId: string): Prisma.Prisma__UserClient<{
        name: string;
        userAccountId: string;
    }>;
    createUser(data: Prisma.UserCreateInput): Prisma.Prisma__UserClient<{
        name: string;
        userAccountId: string;
        public_key: string;
    }>;
    loginUser(data: Prisma.UserWhereUniqueInput & {
        signature: string;
    }): Promise<{
        userAccountId: string;
        name: string;
    }>;
    createStore(data: Prisma.StoreCreateWithoutSellerInput, userAccountId: string): Promise<import(".prisma/client").Store>;
    getAllStoresBySeller(userAccountId: string): Promise<import(".prisma/client").Store[]>;
    getAllStores(skip?: number, take?: number): Promise<import(".prisma/client").Store[]>;
    createBill(data: CreateBillDto['data'], userAccountId: string): Promise<import(".prisma/client").ReceiptRef & {
        store: {
            store_name: string;
            phone_number: number;
            address: string;
            website: string;
            seller: {
                name: string;
                userAccountId: string;
                public_key: string;
            };
        };
        products: import(".prisma/client").Product[];
        buyer: {
            name: string;
            userAccountId: string;
            public_key: string;
        };
    }>;
    getBills(userAccountId: string): Promise<{
        receiptRefs: (import(".prisma/client").ReceiptRef & {
            store: {
                store_name: string;
                phone_number: number;
                address: string;
                website: string;
                seller: {
                    name: string;
                    userAccountId: string;
                    public_key: string;
                };
            };
            products: import(".prisma/client").Product[];
            buyer: {
                name: string;
                userAccountId: string;
                public_key: string;
            };
        })[];
    }>;
}
