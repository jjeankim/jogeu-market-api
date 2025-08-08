-- CreateTable
CREATE TABLE "ProductQnA" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "question" VARCHAR(1000) NOT NULL,
    "answer" VARCHAR(1000),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt" TIMESTAMP(3),

    CONSTRAINT "ProductQnA_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductQnA" ADD CONSTRAINT "ProductQnA_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductQnA" ADD CONSTRAINT "ProductQnA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
