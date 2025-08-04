import prisma from "./prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 시딩 시작...");

  // 비밀번호 해시화
  const hashedPassword = await bcrypt.hash("User@1234", 10);

  // 1. 유저 5명 생성
  console.log("👥 유저 생성 중...");
  await prisma.user.createMany({
    data: [
      {
        email: "user1@email.com",
        password: hashedPassword,
        name: "김사용자",
        phoneNumber: "010-1234-5678",
      },
      {
        email: "user2@email.com", 
        password: hashedPassword,
        name: "이구매자",
        phoneNumber: "010-2345-6789",
      },
      {
        email: "user3@email.com",
        password: hashedPassword,
        name: "박고객",
        phoneNumber: "010-3456-7890",
      },
      {
        email: "user4@email.com",
        password: hashedPassword,
        name: "최멤버",
        phoneNumber: "010-4567-8901",
      },
      {
        email: "user5@email.com",
        password: hashedPassword,
        name: "정회원",
        phoneNumber: "010-5678-9012",
      },
    ],
  });

  // 2. 카테고리 생성
  console.log("📂 카테고리 생성 중...");
  await prisma.category.createMany({
    data: [
      {
        name: "뷰티",
        slug: "beauty",
        description: "화장품, 스킨케어, 메이크업 제품",
        isActive: true,
      },
      {
        name: "푸드",
        slug: "food", 
        description: "건강식품, 영양제, 간식",
        isActive: true,
      },
      {
        name: "리빙",
        slug: "living",
        description: "생활용품, 홈케어 제품",
        isActive: true,
      },
      {
        name: "펫",
        slug: "pet",
        description: "반려동물 용품",
        isActive: true,
      },
    ],
  });

  // 3. 브랜드 5개 생성
  console.log("🏷️ 브랜드 생성 중...");
  await prisma.brand.createMany({
    data: [
      { name: "글로우코스메틱" },
      { name: "네이처랩" },
      { name: "퓨어에센스" },
      { name: "블루밍뷰티" },
      { name: "그린라이프" },
    ] as any,
  });

  // 4. 제품 20개 생성
  console.log("🛍️ 제품 생성 중...");
  const products = [
    // 글로우코스메틱 제품들 (브랜드ID: 1)
    {
      name: "글로우 하이드레이팅 토너 150ml",
      productCode: "GLW001",
      brandId: 1,
      categoryId: 1, // 뷰티
      price: 18000,
      stockQuantity: 120,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "건조한 피부에 깊은 수분을 공급하는 하이드레이팅 토너입니다.",
      isSample: false,
      samplePrice: 1000,
    },
    {
      name: "글로우 비타민C 세럼 30ml", 
      productCode: "GLW002",
      brandId: 1,
      categoryId: 1, // 뷰티
      price: 35000,
      stockQuantity: 80,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "피부 톤 개선과 브라이트닝에 효과적인 비타민C 세럼입니다.",
      isSample: true,
      samplePrice: 2000,
    },
    {
      name: "글로우 수딩 크림 50ml",
      productCode: "GLW003", 
      brandId: 1,
      categoryId: 1, // 뷰티
      price: 28000,
      stockQuantity: 95,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "민감한 피부를 진정시키고 보호하는 수딩 크림입니다.",
      isSample: false,
      samplePrice: 1500,
    },
    {
      name: "글로우 클렌징 폼 120ml",
      productCode: "GLW004",
      brandId: 1,
      categoryId: 1, // 뷰티
      price: 15000,
      stockQuantity: 150,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "부드럽고 깔끔한 세정력의 클렌징 폼입니다.",
      isSample: true,
      samplePrice: 800,
    },

    // 네이처랩 제품들 (브랜드ID: 2)
    {
      name: "네이처랩 티트리 에센스 50ml",
      productCode: "NTL001",
      brandId: 2,
      categoryId: 1, // 뷰티
      price: 32000,
      stockQuantity: 70,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "트러블 케어에 효과적인 천연 티트리 에센스입니다.",
      isSample: false,
      samplePrice: 1800,
    },
    {
      name: "네이처랩 허브 마스크팩 5매",
      productCode: "NTL002",
      brandId: 2,
      categoryId: 1, // 뷰티
      price: 12000,
      stockQuantity: 200,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "진정 효과가 뛰어난 허브 마스크팩 5매 세트입니다.",
      isSample: false,
      samplePrice: 600,
    },
    {
      name: "네이처랩 오가닉 샴푸 300ml",
      productCode: "NTL003",
      brandId: 2,
      categoryId: 3, // 리빙
      price: 22000,
      stockQuantity: 110,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "화학 성분 없는 100% 오가닉 샴푸입니다.",
      isSample: true,
      samplePrice: 1200,
    },
    {
      name: "네이처랩 바디 로션 200ml",
      productCode: "NTL004",
      brandId: 2,
      categoryId: 3, // 리빙
      price: 18000,
      stockQuantity: 130,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "천연 오일이 함유된 보습 바디 로션입니다.",
      isSample: false,
      samplePrice: 1000,
    },

    // 퓨어에센스 제품들 (브랜드ID: 3)
    {
      name: "퓨어에센스 히알루론 앰플 15ml",
      productCode: "PUR001",
      brandId: 3,
      categoryId: 1, // 뷰티
      price: 42000,
      stockQuantity: 60,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "고농축 히알루론산이 함유된 보습 앰플입니다.",
      isSample: true,
      samplePrice: 2500,
    },
    {
      name: "퓨어에센스 콜라겐 크림 30ml",
      productCode: "PUR002",
      brandId: 3,
      categoryId: 1, // 뷰티
      price: 38000,
      stockQuantity: 75,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "탄력과 주름 개선에 도움을 주는 콜라겐 크림입니다.",
      isSample: false,
      samplePrice: 2000,
    },
    {
      name: "퓨어에센스 아이크림 15ml",
      productCode: "PUR003",
      brandId: 3,
      categoryId: 1, // 뷰티
      price: 45000,
      stockQuantity: 50,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "눈가 전용 고농축 아이크림입니다.",
      isSample: true,
      samplePrice: 2200,
    },
    {
      name: "퓨어에센스 클렌징 오일 100ml",
      productCode: "PUR004",
      brandId: 3,
      categoryId: 1, // 뷰티
      price: 25000,
      stockQuantity: 90,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "메이크업과 노폐물을 깔끔하게 제거하는 클렌징 오일입니다.",
      isSample: false,
      samplePrice: 1300,
    },

    // 블루밍뷰티 제품들 (브랜드ID: 4)
    {
      name: "블루밍뷰티 선크림 SPF50+ 50ml",
      productCode: "BLM001",
      brandId: 4,
      categoryId: 1, // 뷰티
      price: 28000,
      stockQuantity: 100,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "강력한 자외선 차단과 보습 효과를 동시에 제공하는 선크림입니다.",
      isSample: false,
      samplePrice: 1500,
    },
    {
      name: "블루밍뷰티 쿠션 파운데이션 15g",
      productCode: "BLM002",
      brandId: 4,
      categoryId: 1, // 뷰티
      price: 32000,
      stockQuantity: 85,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "자연스러운 커버력과 윤기를 연출하는 쿠션 파운데이션입니다.",
      isSample: true,
      samplePrice: 1800,
    },
    {
      name: "블루밍뷰티 립밤 3.5g",
      productCode: "BLM003",
      brandId: 4,
      categoryId: 1, // 뷰티
      price: 8000,
      stockQuantity: 180,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "건조한 입술에 촉촉한 보습을 제공하는 립밤입니다.",
      isSample: false,
      samplePrice: 400,
    },
    {
      name: "블루밍뷰티 미스트 80ml",
      productCode: "BLM004",
      brandId: 4,
      categoryId: 1, // 뷰티
      price: 16000,
      stockQuantity: 140,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "언제 어디서나 간편하게 수분을 보충할 수 있는 미스트입니다.",
      isSample: true,
      samplePrice: 900,
    },

    // 그린라이프 제품들 (브랜드ID: 5)
    {
      name: "그린라이프 프로바이오틱스 60캡슐",
      productCode: "GRN001",
      brandId: 5,
      categoryId: 2, // 푸드
      price: 35000,
      stockQuantity: 120,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "장 건강 개선에 도움을 주는 프로바이오틱스 건강기능식품입니다.",
      isSample: false,
      samplePrice: null,
    },
    {
      name: "그린라이프 비타민D 30정",
      productCode: "GRN002", 
      brandId: 5,
      categoryId: 2, // 푸드
      price: 18000,
      stockQuantity: 150,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "뼈와 면역력 강화에 도움을 주는 비타민D 영양제입니다.",
      isSample: false,
      samplePrice: null,
    },
    {
      name: "그린라이프 오메가3 90캡슐",
      productCode: "GRN003",
      brandId: 5,
      categoryId: 2, // 푸드
      price: 42000,
      stockQuantity: 100,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "심혈관 건강과 두뇌 건강에 도움을 주는 오메가3 영양제입니다.",
      isSample: false,
      samplePrice: null,
    },
    {
      name: "그린라이프 반려동물 영양제 60정",
      productCode: "GRN004",
      brandId: 5,
      categoryId: 4, // 펫
      price: 25000,
      stockQuantity: 80,
      thumbnailImageUrl: "",
      detailImageUrl: "",
      detailDescription: "반려동물의 관절과 털 건강에 도움을 주는 영양제입니다.",
      isSample: false,
      samplePrice: null,
    },
  ];

  // TypeScript 에러를 피하기 위해 타입 단언 사용
  await prisma.product.createMany({
    data: products as any,
  });

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
        validUntil: new Date("2024-12-31"),
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
        validUntil: new Date("2024-12-31"),
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
        validUntil: new Date("2024-10-31"),
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
        validUntil: new Date("2024-09-30"),
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
  console.log("👥 유저 5명, 🏷️ 브랜드 5개, 🛍️ 제품 20개, 🎫 쿠폰 5개가 생성되었습니다!");
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