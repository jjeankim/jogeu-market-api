# 🛒 Jogeu-Market API Server

사용자가 상품을 등록하고, 장바구니/주문/리뷰를 관리할 수 있는 **조그마켓(Jogeu Market)**의 백엔드 API 서버입니다.
Next.js Page Router, Express, Prisma, PostgreSQL, Azure Blob Storage를 활용하여 풀스택 환경에서 동작합니다.

<br/>

## 🖥️ 배포 링크 (Azure App Service)

🔗 https://jogeumarket.azurewebsites.net/

<br/>

## ⚙️ 기술 스택

**Back-End**

![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=black)
![Express](https://img.shields.io/badge/Express-888888?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Azure](https://img.shields.io/badge/Backend_on-Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)

<br/>

## 🔨 사용 라이브러리 및 도구
![dotenv](https://img.shields.io/badge/dotenv-000000?style=for-the-badge)
![CORS](https://img.shields.io/badge/cors-7D4698?style=for-the-badge)
![Nodemon](https://img.shields.io/badge/nodemon-76D04B?style=for-the-badge)
![cookie-parser](https://img.shields.io/badge/cookie--parser-FFB400?style=for-the-badge)
![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6B6B?style=for-the-badge)
![multer-azure-blob-storage](https://img.shields.io/badge/multer--azure--blob--storage-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![@azure/storage-blob](https://img.shields.io/badge/Azure_Storage_Blob-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Swagger UI](https://img.shields.io/badge/Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![swagger-jsdoc](https://img.shields.io/badge/swagger--jsdoc-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![bcrypt](https://img.shields.io/badge/bcrypt-003B57?style=for-the-badge)
![bcryptjs](https://img.shields.io/badge/bcryptjs-003B57?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-5D3FD3?style=for-the-badge)
![compression](https://img.shields.io/badge/compression-46a2f1?style=for-the-badge)
![helmet](https://img.shields.io/badge/helmet-000000?style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)


<br/>

## 📦 설치 및 실행

01 의존성 설치
```
npm install
```
02 개발 서버 실행
```
npm run dev
```
03 빌드 및 실행
```
npm run build
npm start
```

<br/>

## 📡 API 문서 요약
### 인증 / 회원
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| POST | /api/auth/signup | 회원가입 | ❌  |
| POST | /api/auth/login | 로그인 | ❌  |
| GET | /api/users/me | 내 정보 조회 | ✅  |
| GET | /api/users/me/addresses | 내 배송지 목록 | ✅  |
| POST | /api/users/me/addresses | 배송지 추가 | ✅  |
| PUT | /api/users/me/addresses/:id | 배송지 수정 | ✅  |
| PATCH | /api/users/me/addresses/:id/default | 기본배송지 설정 | ✅  |
| PATCH | /api/users/me/password | 비밀번호 변경 | ✅  |
| POST | /api/tokens | refreshToken 재발급 | ❌  |
| DELETE | /api/users/me | 회원탈퇴 | ✅  |

### 상품
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| POST | /api/products | 상품 등록 | ❌  |
| GET | /api/products | 상품 목록 조회 | ❌  |
| GET | /api/products/:id | 상품 상세 조회 | ❌  |
| POST | /api/brands | 브랜드 추가 | ❌  |
| GET | /api/brands | 브랜드 목록 조회 | ❌  |
| GET | /api/products/:id/reviews | 상품 리뷰 조회 | ❌  |
| POST | /api/products/:id/reviews | 리뷰 작성 | ✅  |
| PUT | /api/products/:id/reviews/:reviewId | 리뷰 수정 | ✅  |
| DELETE | /api/products/:id/reviews/:reviewId | 리뷰 삭제 | ✅  |
| POST | /api/products/:id/reviews/:reviewId/like | 리뷰 좋아요 | ✅  |
| DELETE | /api/products/:id/reviews/:reviewId/like | 리뷰 좋아요 취소 | ✅  |
| GET | /api/products/:id/reviews/:reviewId/tags | 리뷰 태그 조회 | ❌  |
| POST | /api/products/:id/reviews/:reviewId/tags | 리뷰 태그 추가 | ✅  |

### 장바구니
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| GET | /api/cart | 장바구니 조회 | ✅  |
| POST | /api/cart | 장바구니 추가 | ✅  |
| PATCH | /api/cart/:id | 장바구니 수량 변경 | ✅  |
| DELETE | /api/cart/:id | 장바구니 상품 삭제 | ✅  |

### 위시리스트
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| GET | /api/wishlist | 위시리스트 조회 | ✅  |
| POST | /api/wishlist/:productId | 위시리스트 추가/삭제 | ✅  |

### 주문
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| POST | /api/orders | 주문 생성 | ✅  |
| GET | /api/orders | 주문 목록 조회 | ✅  |
| GET | /api/orders/:id | 주문 상세 조회 | ✅  |
| PATCH | /api/orders/:id/status | 주문 상태 변경 | ✅  |

### 쿠폰
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| GET | /api/coupon | 전체 쿠폰 목록 조회 | ✅  |
| GET | /api/coupon/me | 내 쿠폰 조회 | ✅  |
| POST | /api/coupon/me | 쿠폰 발급 | ✅  |
| PATCH | /api/coupon/me/:id | 쿠폰 사용 처리 | ✅  |

### 샘플
| 메서드 | 경로 | 설명 | 인증 여부 |
|--------|------|------|-----------|
| GET | /api/samples | 샘플 상품 목록 | ❌  |
| POST | /api/samples/orders | 샘플 주문 생성 | ✅  |
| POST | /api/samples/coupons | 샘플 구매 후 쿠폰 지급 | ✅  |


<br />

## 🔐 환경 변수 (.env 예시)

프로젝트 루트에 .env 파일을 생성하고 아래와 같이 작성하세요. .env 파일은 gitignore에 추가해 버전 관리에서 제외하세요.
```
# PostgreSQL Database (Azure)
DIRECT_URL="postgresql://user:password@host:5432/postgres"
DATABASE_URL="postgresql://user:password@host:5432/postgres"

# JWT Secret
JWT_ACCESS_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT_NAME="your_storage_account"
AZURE_STORAGE_ACCOUNT_KEY="your_storage_account_key"
AZURE_STORAGE_CONTAINER_NAME="your_container_name"

# Kakao OAuth
NEXT_PUBLIC_KAKAO_CLIENT_ID="your_kakao_client_id"
NEXT_PUBLIC_KAKAO_REDIRECT_URI="https://your-domain.com/oauth/kakao"

# Naver OAuth
NEXT_PUBLIC_NAVER_CLIENT_ID="your_naver_client_id"
NEXT_PUBLIC_NAVER_CLIENT_SECRET="your_naver_client_secret"
NEXT_PUBLIC_NAVER_REDIRECT_URI="https://your-domain.com/oauth/naver"

```

<br />

## 📁 프로젝트 구조 예시

```
📦 jogeu-market-api
├── 📁 .github              # GitHub 이슈/PR 템플릿 및 워크플로우
│   ├── 📁 ISSUE_TEMPLATE   # 이슈 템플릿
│   ├── 📁 workflows        # GitHub Actions CI/CD
│   └── 📄 pull_request_template.md # PR 템플릿
│
├── 📁 dist                 # 빌드된 결과물 (TS → JS)
├── 📁 node_modules         # 의존성 모듈
├── 📁 prisma               # Prisma 스키마 및 마이그레이션
├── 📁 public               # 정적 파일 (업로드 이미지 등)
│
├── 📁 src                  # 소스 코드
│   ├── 📁 config           # 환경 설정, DB 연결 등
│   ├── 📁 constants        # 상수 모음
│   ├── 📁 controllers      # 라우트별 비즈니스 로직
│   ├── 📁 docs             # API 문서 (Swagger 등)
│   ├── 📁 lib              # 유틸 함수, 외부 서비스 연동
│   ├── 📁 middleware       # 인증, 에러 핸들링, 로깅 등 미들웨어
│   ├── 📁 routes           # Express 라우터 정의
│   ├── 📁 types            # 타입 정의 (Express 확장 등)
│   ├── 📁 upload           # 파일 업로드 처리 (예: Multer, Azure Blob)
│   ├── 📁 utils            # 공통 유틸 함수
│   ├── 📁 validator        # 요청 데이터 검증 (Zod 등)
│   └── 📄 app.ts           # Express 앱 초기화 진입점
│
├── 📄 .env                 # 환경 변수 설정
├── 📄 .gitignore           # Git 제외 파일
├── 📄 package.json         # 프로젝트 메타 및 의존성
├── 📄 package-lock.json    # 의존성 잠금 파일
├── 📄 README.md            # 프로젝트 설명 문서
└── 📄 tsconfig.json        # TypeScript 설정
```

<br/>

## 🌐 CORS 설정

현재 백엔드에는 다음의 origin만 요청을 허용하도록 설정되어 있습니다. 필요 시 특정 origin만 허용하도록 수정할 수 있습니다.
```
- http://localhost:3000 (개발용)
- https://www.jogeumarket.store (운영)

운영/개발 환경별로 origin은 환경변수에서 관리됩니다.  
.env 파일에서 `CORS_ORIGINS` 항목을 수정하면 됩니다.

```

