import prisma from "./prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 시딩 시작...");


  // 기존 쿠폰 삭제 후 새로 생성
  console.log("🗑️ 기존 쿠폰 삭제 중...");
  await prisma.coupon.deleteMany({});
  
  // 5. 쿠폰 5개 생성
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