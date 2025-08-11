"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 장바구니 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         quantity:
 *           type: integer
 *           description: 수량
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: 상품 ID (필수)
 *           example: 1
 *         quantity:
 *           type: integer
 *           description: 수량 (필수)
 *           example: 2
 *     UpdateCartRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           description: 수량 (필수)
 *           example: 3
 *     CartResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "✅ 카트에 제품이 성공적으로 담겼습니다."
 *         carts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cart'
 *           example:
 *             - id: 1
 *               userId: 1
 *               productId: 1
 *               quantity: 2
 *               product:
 *                 id: 1
 *                 name: "샘플 상품"
 *                 price: 10000
 *               createdAt: "2024-07-28T12:00:00.000Z"
 *               updatedAt: "2024-07-28T12:00:00.000Z"
 */
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: 장바구니에 상품 추가
 *     tags: [장바구니]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCartRequest'
 *           example:
 *             productId: 1
 *             quantity: 2
 *     responses:
 *       201:
 *         description: 장바구니 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *             example:
 *               message: "✅ 카트에 제품이 성공적으로 담겼습니다."
 *               carts:
 *                 - id: 1
 *                   userId: 1
 *                   productId: 1
 *                   quantity: 2
 *                   product:
 *                     id: 1
 *                     name: "샘플 상품"
 *                     price: 10000
 *                   createdAt: "2024-07-28T12:00:00.000Z"
 *                   updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   get:
 *     summary: 장바구니 조회
 *     tags: [장바구니]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *             example:
 *               message: "✅ 장바구니가 성공적으로 조회되었습니다."
 *               carts:
 *                 - id: 1
 *                   userId: 1
 *                   productId: 1
 *                   quantity: 2
 *                   product:
 *                     id: 1
 *                     name: "샘플 상품"
 *                     price: 10000
 *                   createdAt: "2024-07-28T12:00:00.000Z"
 *                   updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
/**
 * @swagger
 * /api/cart/{id}:
 *   patch:
 *     summary: 장바구니 수량 수정
 *     tags: [장바구니]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 장바구니 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartRequest'
 *     responses:
 *       200:
 *         description: 장바구니 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ 상품이 성공적으로 수정되었습니다."
 *                 products:
 *                   $ref: '#/components/schemas/Cart'
 *       500:
 *         description: 서버 오류
 *   delete:
 *     summary: 장바구니에서 상품 삭제
 *     tags: [장바구니]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 장바구니 ID
 *     responses:
 *       200:
 *         description: 장바구니 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ 상품이 성공적으로 삭제되었습니다."
 *                 products:
 *                   $ref: '#/components/schemas/Cart'
 *       500:
 *         description: 서버 오류
 */ 
