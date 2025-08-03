import prisma from "./prisma";

async function clearData() {
  try {
    // 기존 데이터 삭제 (순서 중요: 외래키 제약조건 때문에)
    await prisma.product.deleteMany({});
    await prisma.brand.deleteMany({});
    
    console.log("✅ 기존 데이터 삭제 완료!");
  } catch (error) {
    console.error("❌ 데이터 삭제 에러:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData(); 