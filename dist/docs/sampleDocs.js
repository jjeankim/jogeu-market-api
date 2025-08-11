"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     SampleOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 샘플 주문 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         quantity:
 *           type: integer
 *           description: 수량
 *         status:
 *           type: string
 *           enum: [대기중, 승인됨, 거부됨, 배송중, 완료]
 *           description: 샘플 주문 상태
 *         requestMessage:
 *           type: string
 *           description: 요청 메시지
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateSampleOrderRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: 상품 ID (필수)
 *         quantity:
 *           type: integer
 *           description: 수량 (필수)
 *         requestMessage:
 *           type: string
 *           description: 요청 메시지
 *     SampleOrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "샘플 주문이 성공적으로 생성되었습니다."
 *         sampleOrder:
 *           $ref: '#/components/schemas/SampleOrder'
 */
/**
 * @swagger
 * /api/samples:
 *   get:
 *     summary: 샘플 목록 조회
 *     tags: [샘플]
 *     responses:
 *       200:
 *         description: 샘플 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "샘플 목록 조회 성공"
 *                 samples:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: 서버 오류
 */
/**
 * @swagger
 * /api/samples/orders:
 *   post:
 *     summary: 샘플 주문 생성
 *     tags: [샘플]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSampleOrderRequest'
 *     responses:
 *       201:
 *         description: 샘플 주문 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SampleOrderResponse'
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */ 
