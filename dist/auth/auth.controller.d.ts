import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from "@nestjs/jwt";
declare type body<T> = {
    data: T;
};
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    createUser(body: body<Prisma.UserCreateInput>, req: any): Promise<{
        name: string;
        userAccountId: string;
        public_key: string;
    }>;
    loginUser(body: LoginUserDto, req: any): Promise<{
        userAccountId: string;
        name: string;
    }>;
    createStore(body: body<Prisma.StoreCreateWithoutSellerInput>, user: {
        userAccountId: string;
        name: string;
    }): Promise<import(".prisma/client").Store>;
    getAllStoresBySeller(userAccountId: string): Promise<import(".prisma/client").Store[]>;
    getAllStores(): Promise<import(".prisma/client").Store[]>;
    createBill(body: CreateBillDto, user: {
        userAccountId: string;
        name: string;
    }): Promise<import(".prisma/client").ReceiptRef & {
        products: import(".prisma/client").Product[];
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
        buyer: {
            name: string;
            userAccountId: string;
            public_key: string;
        };
    }>;
    getBills(user: {
        userAccountId: string;
        name: string;
    } | undefined): Promise<{
        receiptRefs: (import(".prisma/client").ReceiptRef & {
            products: import(".prisma/client").Product[];
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
            buyer: {
                name: string;
                userAccountId: string;
                public_key: string;
            };
        })[];
    }>;
    getCurrentUser(user: {
        userAccountId: string;
        name: string;
    } | undefined): Prisma.Prisma__UserClient<{
        name: string;
        userAccountId: string;
    }>;
    logOut(req: any): void;
}
export {};
