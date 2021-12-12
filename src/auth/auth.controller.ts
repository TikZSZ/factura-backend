import { PublicKey } from '@hashgraph/sdk';
import { BadRequestException, Body, Controller, Get, NotFoundException,Req, Param, Post ,Session, UnauthorizedException, ParseIntPipe} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { LoginUserDto } from './dto/login.dto';
import {JwtService} from "@nestjs/jwt"
import {User} from "./decorators"
type body<T> = {
  data: T;
};

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService,private jwtService: JwtService) {}
  
  @Post('/createUser')
  async createUser(@Body() body: body<Prisma.UserCreateInput>,@Req() req:any) {
    const isCorrect = PublicKey.fromString(body.data.public_key).verify(Buffer.from("bills"),Buffer.from(body.data.signature as any,"hex"));
    if(!isCorrect) throw new BadRequestException() 
    const createdUser = await  this.authService.createUser(body.data);
    const token = this.jwtService.sign({userAccountId:createdUser.userAccountId,name:createdUser.name})
    req.session['user'] = token
    return createdUser
  }

  @Post('/loginUser')
  async loginUser(@Body() body: LoginUserDto,@Req() req:any) {
    const foundUser = await this.authService.loginUser(body.data);
    const token = this.jwtService.sign(foundUser)
    req.session['user'] = token
    return foundUser
  }

  @Post('/createStore')
  createStore(
    @Body() body: body<Prisma.StoreCreateWithoutSellerInput>,
    @User() user:{userAccountId:string,name:string}
  ) {
    return this.authService.createStore(body.data, user.userAccountId);
  }

  @Get('/getAllStoresBySeller/:userAccountId')
  getAllStoresBySeller(@Param('userAccountId') userAccountId: string) {
    return this.authService.getAllStoresBySeller(userAccountId);
  }

  @Get('/getAllStores')
  getAllStores() {
    return this.authService.getAllStores();
  }

  @Post('/createBill')
  createBill(
    @Body() body: CreateBillDto,
    @User() user:{userAccountId:string,name:string}
  ) {
    console.log(body.data);
    return this.authService.createBill(body.data, user.userAccountId);
  }

  @Get('/getBill/:receipt_id')
  getBills(@Param('receipt_id',ParseIntPipe) receipt_id:number) {
    if(!receipt_id){
      throw new BadRequestException()
    }
    return this.authService.getBill(receipt_id);
  }

  @Get("/getReceiptsForUser")
  getReceiptsForUser(@User() user:{userAccountId:string,name:string}|undefined){
    if(!user){
      throw new UnauthorizedException()
    }
    return this.authService.getReceiptsForUser(user.userAccountId);
  }

  @Get("/getReceiptsForStore/:storeId")
  getReceiptsForStore(@Param('storeId',ParseIntPipe) storeId:number){
    if(!storeId){
      throw new BadRequestException()
    }
    return this.authService.getReceiptsForStore(storeId);
  }

  @Get("/currentUser")
  getCurrentUser(@User() user:{userAccountId:string,name:string}|undefined) {
    if(!user){
      throw new NotFoundException()
    }
    return this.authService.getCurrentUser(user.userAccountId)
  }

  @Get("/logout")
  logOut(@Req() req:any){
    req.session['user'] = null;
    return 
  }
}
