import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBillDto } from './dto/create-bill.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  getCurrentUser(accountId:string){
    return this.prisma.user.findUnique({
    where:{
      userAccountId:accountId,
    },
    select:{
      name:true,userAccountId:true
    }})
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        userAccountId: true,
        public_key: true,
        name: true,
      },
    });
  }

  async loginUser(data: Prisma.UserWhereUniqueInput & { signature: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        userAccountId: data.userAccountId,
      },
    });

    if (!user) throw new NotFoundException();

    if (!(user.signature === data.signature)) throw new UnauthorizedException();

    return {
      userAccountId: user.userAccountId,
      name:user.name
    };
  }

  async createStore(
    data: Prisma.StoreCreateWithoutSellerInput,
    userAccountId: string,
  ) {
    return this.prisma.store.create({
      data: { ...data, seller_id: userAccountId },
    });
  }

  async getAllStoresBySeller(userAccountId: string) {
    return this.prisma.store.findMany({
      where: {
        seller_id: userAccountId,
      },
    });
  }

  async getAllStores(skip:number = 0,take:number = 10) {
    return this.prisma.store.findMany({
      skip,take,orderBy:{
        timeRegistred:'desc'
      }
    });
  }

  async createBill(data: CreateBillDto['data'], userAccountId: string) {
    const {
      buyerId,
      storeId,
      products,
      time,
      sequence_no,
      signature,
      timestamp,
    } = data;

    const sellerAccount = await this.prisma.store.findUnique({
      where: { store_id: storeId },
      select: {
        seller_id: true,
      },
    });

    if (!sellerAccount) throw new NotFoundException();

    if (!(sellerAccount.seller_id === userAccountId)) throw new UnauthorizedException();

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

  async getBills(userAccountId: string) {
    return this.prisma.user.findUnique({
      where: {
        userAccountId,
      },
      select: {
        receiptRefs: {		  
          orderBy:{
            receipt_id:'desc'
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
}
