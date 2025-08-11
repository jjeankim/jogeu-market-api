import "dotenv/config";
import prisma from "./prisma";

async function clearData() {
  try {
    // 기존 데이터 삭제 (순서 중요: 외래키 제약조건 때문에)
    await prisma.userCoupon.deleteMany({});
    await prisma.reviewTag.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.productQnA.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.coupon.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log("✅ 모든 기존 데이터 완전 삭제 완료!");
  } catch (error) {
    console.error("❌ 데이터 삭제 에러:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData(); 