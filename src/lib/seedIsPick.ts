// scripts/seedIsPick.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: { isPick: Math.random() < 0.5 }, // 50% 확률로 true/false
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
