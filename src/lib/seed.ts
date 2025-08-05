import prisma from "./prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 시딩 시작...");

  // 기존 데이터 삭제 (순서 중요: 외래키 제약조건 때문에)
  console.log("🗑️ 기존 데이터 삭제 중...");
  await prisma.userCoupon.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  
  // 브랜드 데이터 추가
  console.log("🏷️ 브랜드 생성 중...");
  await prisma.brand.createMany({
    data: [
      { name: "에버블룸" },
      { name: "블루허브" },
      { name: "루나화이트" },
      { name: "네이처소울" },
      { name: "그린필드" },
      { name: "퓨어딥" },
      { name: "아쿠아하이드" },
      { name: "로지스킨" },
      { name: "피토베라" },
      { name: "오가닉테라" },
    ],
  });

  // 상품 데이터 추가
  console.log("📦 상품 생성 중...");
  await prisma.product.createMany({
    data: [
      {
        name: "에버블룸 수분크림 50ml",
        productCode: "PRD1001",
        brandId: 1,
        price: 28000,
        stockQuantity: 100,
        thumbnailImageUrl: "",
        detailDescription: "피부 깊숙이 수분을 채워주는 고보습 크림",
        isSample: false,
        samplePrice: 1000,
        categoryId: 1,
      },
      {
        name: "에버블룸 클렌징폼",
        productCode: "PRD1002",
        brandId: 1,
        price: 15000,
        stockQuantity: 150,
        thumbnailImageUrl: "",
        detailDescription: "자극 없이 세정력 좋은 클렌징폼",
        isSample: true,
        samplePrice: 500,
        categoryId: 1,
      },
    ],
  });

  // 쿠폰 5개 생성
  console.log("🎫 쿠폰 생성 중...");
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        name: "신규 회원 10% 할인",
        discountType: "PERCENTAGE", 
        discountValue: 10,
        minOrderAmount: 30000,
        validFrom: new Date("2024-08-01"),
        validUntil: new Date("2025-12-31"),
        isActive: true,
        usageLimit: 100,
        issuedBySamplePurchase: false,
      },
      {
        code: "SAMPLE5000",
        name: "샘플 구매 후 5000원 할인",
        discountType: "FIXED",
        discountValue: 5000,
        minOrderAmount: 20000,
        validFrom: new Date("2024-08-01"),
        validUntil: new Date("2025-12-31"),
        isActive: true,
        usageLimit: 50,
        issuedBySamplePurchase: true,
      },
      {
        code: "BEAUTY15",
        name: "뷰티 제품 15% 할인",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderAmount: 50000,
        validFrom: new Date("2024-08-01"),
        validUntil: new Date("2025-10-31"),
        isActive: true,
        usageLimit: 200,
        issuedBySamplePurchase: false,
      },
      {
        code: "FREE3000",
        name: "3000원 즉시 할인",
        discountType: "FIXED",
        discountValue: 3000,
        minOrderAmount: 15000,
        validFrom: new Date("2024-08-01"),
        validUntil: new Date("2025-09-30"),
        isActive: true,
        usageLimit: 500,
        issuedBySamplePurchase: false,
      },
      {
        code: "VIP20",
        name: "VIP 회원 20% 할인",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderAmount: 100000,
        validFrom: new Date("2024-08-01"),
        validUntil: new Date("2025-01-31"),
        isActive: true,
        usageLimit: 30,
        issuedBySamplePurchase: false,
      },
    ],
  });

  console.log("✅ 시딩 완료!");

}

main()
  .then(() => {
    console.log("🌱 데이터베이스 시딩이 성공적으로 완료되었습니다!");
  })
  .catch((e) => {
    console.error("❌ 시딩 에러:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });