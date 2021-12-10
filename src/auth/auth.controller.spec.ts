import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrivateKey, } from '@hashgraph/sdk';
import { CreateBillDto } from './dto/create-bill.dto';
import {JwtModule} from "@nestjs/jwt"

const id = Math.random() * 1000;
const privateKey = PrivateKey.generate();
let userAccountId = `0.0.${Math.floor(id)}`;
let signature = sign('bills').toString('hex');

function sign(str: string) {
  const bytesStr = Buffer.from(str);
  const signedBytes = privateKey.sign(bytesStr);
  return Buffer.from(signedBytes);
}

describe('AuthController', () => {
  let controller: AuthController;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[JwtModule.register({secret:'asdf'})],
      controllers: [AuthController],
      providers: [AuthService, PrismaService],
    })
      .compile()
    
    controller = module.get<AuthController>(AuthController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.product.deleteMany();
    await prismaService.receiptRef.deleteMany();
    await prismaService.store.deleteMany();
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.product.deleteMany();
    await prismaService.receiptRef.deleteMany();
    await prismaService.store.deleteMany();
    await prismaService.user.deleteMany();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const { response, data } = await createUser();
    expect(response.userAccountId).toEqual(data.userAccountId);
  });

  it('should login user', async () => {
    await createUser();

    let data = {
      userAccountId,
      signature,
    };

    const resp = await controller.loginUser({ data }, {session:{}});
    expect(resp.userAccountId).toEqual(data.userAccountId);

    // throw not found user
  });

  it('should throw not found error', async () => {
    let data = {
      userAccountId,
      signature,
    };

    try {
      await controller.loginUser({ data: { ...data } }, {userAccountId,name:""});
      throw new Error();
    } catch (err) {
      expect(err.status).toEqual(404);
    }
  });

  it('should throw unauthorised error', async () => {
    await createUser();

    let data = {
      userAccountId,
      signature,
    };

    try {
      await controller.loginUser({ data: { ...data, signature: '' } }, {userAccountId,name:""});
      throw new Error();
    } catch (err) {
      expect(err.status).toEqual(401);
    }
  });

  it('should create a store associated with the user', async () => {
    await createUser();
    const resp = await createStore();
    expect(resp.store_id).toBeDefined();
    expect(resp.seller_id).toEqual(userAccountId);
  });

  it('should get all stores for a seller', async () => {
    await createUser();
    await createStore();
    await createStore();
    await createStore();
    const resp = await controller.getAllStoresBySeller(userAccountId);
    expect(resp.length).toEqual(3);
  });

  it('should create and return a bill', async () => {
    const user = await createUser();
    const store = await createStore();
    const data: Omit<
      CreateBillDto['data'],
      'signature' | 'timestamp' | 'sequence_no'
    > = {
      time: new Date().toUTCString(),
      storeId: store.store_id,
      buyerId: user.response.userAccountId,
      products: [
        {
          price: 3299,
          discount: 299,
          tax: 459,
          total: 2541,
          product_name: 'realme Buds Air 2',
        },
        {
          price: 1599,
          discount: 99,
          tax: 200,
          total: 3000,
          product_name: 'realme Buds Q2 Neo',
        },
      ],
    };

    const signature = Buffer.from(
      privateKey.sign(Buffer.from(JSON.stringify(data))),
    ).toString('hex');

    const signedData: CreateBillDto['data'] = {
      ...data,
      signature,
      timestamp: '102520.151205',
      sequence_no: 5,
    };
    
    const resp = await controller.createBill(
      { data: signedData },
      {userAccountId,name:""},
    );
    console.log(resp);

    expect(resp.products.length).toEqual(data.products.length);
    expect(resp.receipt_id).toBeDefined();
    expect(resp.products[0].receipt_id).toEqual(resp.receipt_id);
  });

  async function createStore() {
    let data = {
      address: '8-II-52',
      country: 'India',
      phone_number: 9815745689,
      store_name: 'Arcane',
      website: 'www.tikzsz_portfolio.com',
      timeRegistred: new Date().toUTCString(),
    };
    let signedData: Prisma.StoreCreateWithoutSellerInput = {
      ...data,
      signature: sign(JSON.stringify(data)).toString('hex'),
      timestamp: '',
      sequence_no: 3,
    };
    const resp = await controller.createStore(
      { data: signedData },
      {userAccountId,name:""},
    );
    return resp;
  }

  async function createUser() {
    let data = {
      userAccountId,
      name: 'Aditya',
      public_key: privateKey.publicKey.toString(),
      country: 'India',
      signature,
    };
    const response = await controller.createUser({ data }, {session:{}});
    return { response, data };
  }
});
