import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested,IsOptional, Min, min, } from "class-validator";

type data = {
  buyerId: string;
  storeId: number;
  products: Prisma.ProductCreateWithoutReceipt_refsInput[];
}

class ProductsBody implements Prisma.ProductCreateWithoutReceipt_refsInput{
  @IsString()
  product_name:string

  @IsNumber()
  @Min(0)
  price:number

  @IsOptional()
  @IsNumber()
  @Min(1)
  qty?:number

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?:number

  @IsOptional()
  @IsNumber({})
  @Min(0)
  discount?:number

  @IsNumber()
  @Min(0)
  total:number

  @IsOptional()
  @IsString()
  payment_method?:string
  
  @IsNumber()
  @Min(0)
  seq: number;
}

class CreateBillBody{
  @IsString()
  buyerId:string

  @IsNumber()
  storeId:number

  @IsString()
  time:string

  @IsArray()
  @ValidateNested({each:true})
  @Type(()=>ProductsBody)
  products:ProductsBody[]

  @IsString()
  signature:string

  @IsString()
  timestamp:string

  @IsNumber()
  sequence_no:number
}

export class CreateBillDto{
  @Type(()=>CreateBillBody)
  data:CreateBillBody
}


