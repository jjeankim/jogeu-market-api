/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 쿠폰 ID
 *           example: 1
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *           example: 1
 *         code:
 *           type: string
 *           description: 쿠폰 코드
 *           example: "WELCOME10"
 *         discountAmount:
 *           type: number
 *           description: 할인 금액
 *           example: 1000
 *         discountType:
 *           type: string
 *           enum: [PERCENTAGE, FIXED_AMOUNT]
 *           description: 할인 타입 (퍼센트 또는 고정 금액)
 *           example: "FIXED_AMOUNT"
 *         minOrderAmount:
 *           type: number
 *           description: 최소 주문 금액
 *           example: 5000
 *         isUsed:
 *           type: boolean
 *           description: 사용 여부
 *           example: false
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: 만료일
 *           example: "2024-12-31T23:59:59.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *     CreateCouponRequest:
 *       type: object
 *       required:
 *         - code
 *         - discountAmount
 *         - discountType
 *       properties:
 *         code:
 *           type: string
 *           description: 쿠폰 코드 (필수)
 *           example: "WELCOME10"
 *         discountAmount:
 *           type: number
 *           description: 할인 금액 (필수)
 *           example: 1000
 *         discountType:
 *           type: string
 *           enum: [PERCENTAGE, FIXED_AMOUNT]
 *           description: 할인 타입 (필수)
 *           example: "FIXED_AMOUNT"
 *         minOrderAmount:
 *           type: number
 *           description: 최소 주문 금액
 *           example: 5000
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: 만료일
 *           example: "2024-12-31T23:59:59.000Z"
 *     CouponResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "쿠폰이 성공적으로 생성되었습니다."
 *         coupon:
 *           $ref: '#/components/schemas/Coupon'
 *           example:
 *             id: 1
 *             userId: 1
 *             code: "WELCOME10"
 *             discountAmount: 1000
 *             discountType: "FIXED_AMOUNT"
 *             minOrderAmount: 5000
 *             isUsed: false
 *             expiresAt: "2024-12-31T23:59:59.000Z"
 *             createdAt: "2024-07-28T12:00:00.000Z"
 *             updatedAt: "2024-07-28T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/coupon/me/coupon:
 *   post:
 *     summary: 내 쿠폰 생성
 *     tags: [쿠폰]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCouponRequest'
 *           example:
 *             code: "WELCOME10"
 *             discountAmount: 1000
 *             discountType: "FIXED_AMOUNT"
 *             minOrderAmount: 5000
 *             expiresAt: "2024-12-31T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: 쿠폰 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CouponResponse'
 *             example:
 *               message: "쿠폰이 성공적으로 생성되었습니다."
 *               coupon:
 *                 id: 1
 *                 userId: 1
 *                 code: "WELCOME10"
 *                 discountAmount: 1000
 *                 discountType: "FIXED_AMOUNT"
 *                 minOrderAmount: 5000
 *                 isUsed: false
 *                 expiresAt: "2024-12-31T23:59:59.000Z"
 *                 createdAt: "2024-07-28T12:00:00.000Z"
 *                 updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   get:
 *     summary: 내 쿠폰 조회
 *     tags: [쿠폰]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내 쿠폰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "내 쿠폰 조회 성공"
 *                 coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *                   example:
 *                     - id: 1
 *                       userId: 1
 *                       code: "WELCOME10"
 *                       discountAmount: 1000
 *                       discountType: "FIXED_AMOUNT"
 *                       minOrderAmount: 5000
 *                       isUsed: false
 *                       expiresAt: "2024-12-31T23:59:59.000Z"
 *                       createdAt: "2024-07-28T12:00:00.000Z"
 *                       updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/coupon:
 *   get:
 *     summary: 전체 쿠폰 조회
 *     tags: [쿠폰]
 *     responses:
 *       200:
 *         description: 전체 쿠폰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "전체 쿠폰 조회 성공"
 *                 coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/coupon/me/{id}:
 *   patch:
 *     summary: 쿠폰 사용
 *     tags: [쿠폰]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 쿠폰 ID
 *     responses:
 *       200:
 *         description: 쿠폰 사용 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "쿠폰이 성공적으로 사용되었습니다."
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 쿠폰을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */ 