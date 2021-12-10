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
    createUser(body: body<Prisma.UserCreateInput>, req: any): Promise<any>;
    loginUser(body: LoginUserDto, req: any): Promise<{
        userAccountId: any;
        name: any;
    }>;
    createStore(body: body<Prisma.StoreCreateWithoutSellerInput>, user: {
        userAccountId: string;
        name: string;
    }): Promise<any>;
    getAllStoresBySeller(userAccountId: string): Promise<any>;
    getAllStores(): Promise<any>;
    createBill(body: CreateBillDto, user: {
        userAccountId: string;
        name: string;
    }): Promise<any>;
    getBills(user: {
        userAccountId: string;
        name: string;
    } | undefined): Promise<any>;
    getCurrentUser(user: {
        userAccountId: string;
        name: string;
    } | undefined): any;
    logOut(req: any): void;
}
export {};
