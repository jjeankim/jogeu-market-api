import prisma from "./prisma";

async function main() {
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        name: "Welcome Coupon",
        discountType: "percentage",
        discountValue: 10.0,
        minOrderAmount: 30000,
        validFrom: new Date("2025-07-01T00:00:00Z"),
        validUntil: new Date("2025-12-31T23:59:59Z"),
        isActive: true,
        usageLimit: 100,
        issuedBySamplePurchase: false,
      },
      {
        code: "SAMPLE5000",
        name: "Sample Purchase Coupon",
        discountType: "fixed_amount",
        discountValue: 5000.0,
        minOrderAmount: null,
        validFrom: new Date("2025-07-01T00:00:00Z"),
        validUntil: new Date("2025-12-31T23:59:59Z"),
        isActive: true,
        usageLimit: null,
        issuedBySamplePurchase: true,
      },
      {
        code: "SUMMER15",
        name: "Summer Sale 15%",
        discountType: "percentage",
        discountValue: 15.0,
        minOrderAmount: 20000,
        validFrom: new Date("2025-07-15T00:00:00Z"),
        validUntil: new Date("2025-08-31T23:59:59Z"),
        isActive: true,
        usageLimit: 50,
        issuedBySamplePurchase: false,
      },
      {
        code: "FIXED3000",
        name: "Fixed ₩3,000 Coupon",
        discountType: "fixed_amount",
        discountValue: 3000.0,
        minOrderAmount: 10000,
        validFrom: new Date("2025-07-01T00:00:00Z"),
        validUntil: new Date("2025-09-30T23:59:59Z"),
        isActive: true,
        usageLimit: 500,
        issuedBySamplePurchase: false,
      },
      {
        code: "VIP20",
        name: "VIP 전용 20%",
        discountType: "percentage",
        discountValue: 20.0,
        minOrderAmount: 50000,
        validFrom: new Date("2025-07-01T00:00:00Z"),
        validUntil: new Date("2025-12-31T23:59:59Z"),
        isActive: true,
        usageLimit: 30,
        issuedBySamplePurchase: false,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("✅ 쿠폰 데이터 시딩 완료!");
  })
  .catch((e) => {
    console.error("❌ 시딩 에러:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
