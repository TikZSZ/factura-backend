-- CreateTable
CREATE TABLE "User" (
    "userAccountId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "signature" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Store" (
    "store_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "store_name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "timeRegistred" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "sequence_no" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    CONSTRAINT "Store_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User" ("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReceiptRef" (
    "receipt_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" TEXT NOT NULL,
    "store_id" INTEGER NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "sequence_no" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    CONSTRAINT "ReceiptRef_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store" ("store_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReceiptRef_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User" ("userAccountId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seq" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "tax" DECIMAL NOT NULL DEFAULT 0,
    "discount" DECIMAL NOT NULL DEFAULT 0,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "total" DECIMAL NOT NULL,
    "receipt_id" INTEGER NOT NULL,
    CONSTRAINT "Product_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "ReceiptRef" ("receipt_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
