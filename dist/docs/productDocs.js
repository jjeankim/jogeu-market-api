"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 상품 ID
 *           example: 1
 *         name:
 *           type: string
 *           description: 상품명
 *           example: "샘플 상품"
 *         productCode:
 *           type: string
 *           description: 상품 코드
 *           example: "P-001"
 *         brandId:
 *           type: integer
 *           description: 브랜드 ID
 *           example: 1
 *         price:
 *           type: number
 *           description: 상품 가격
 *           example: 10000
 *         stockQuantity:
 *           type: integer
 *           description: 재고 수량
 *           example: 50
 *         thumbnailImageUrl:
 *           type: string
 *           description: 썸네일 이미지 URL
 *           example: "https://example.com/image.jpg"
 *         detailDescription:
 *           type: string
 *           description: 상세 설명
 *           example: "이 상품은 ..."
 *         isSample:
 *           type: boolean
 *           description: 샘플 상품 여부
 *           example: false
 *         samplePrice:
 *           type: number
 *           description: 샘플 가격
 *           example: 1000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: 상품명 (필수)
 *           example: "샘플 상품"
 *         productCode:
 *           type: string
 *           description: 상품 코드
 *           example: "P-001"
 *         brandId:
 *           type: integer
 *           description: 브랜드 ID
 *           example: 1
 *         price:
 *           type: number
 *           description: 상품 가격 (필수)
 *           example: 10000
 *         stockQuantity:
 *           type: integer
 *           description: 재고 수량
 *           example: 50
 *         thumbnailImageUrl:
 *           type: string
 *           description: 썸네일 이미지 URL
 *           example: "https://example.com/image.jpg"
 *         detailDescription:
 *           type: string
 *           description: 상세 설명
 *           example: "이 상품은 ..."
 *         isSample:
 *           type: boolean
 *           description: 샘플 상품 여부
 *           example: false
 *         samplePrice:
 *           type: number
 *           description: 샘플 가격
 *           example: 1000
 *     ProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "✅ 상품이 성공적으로 등록되었습니다."
 *         products:
 *           $ref: '#/components/schemas/Product'
 *           example:
 *             id: 1
 *             name: "샘플 상품"
 *             productCode: "P-001"
 *             brandId: 1
 *             price: 10000
 *             stockQuantity: 50
 *             thumbnailImageUrl: "https://example.com/image.jpg"
 *             detailDescription: "이 상품은 ..."
 *             isSample: false
 *             samplePrice: 1000
 *             createdAt: "2024-07-28T12:00:00.000Z"
 *             updatedAt: "2024-07-28T12:00:00.000Z"
 */
/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: 상품 등록
 *     tags: [상품]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             name: "샘플 상품"
 *             productCode: "P-001"
 *             brandId: 1
 *             price: 10000
 *             stockQuantity: 50
 *             thumbnailImageUrl: "https://example.com/image.jpg"
 *             detailDescription: "이 상품은 ..."
 *             isSample: false
 *             samplePrice: 1000
 *     responses:
 *       201:
 *         description: 상품 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *             example:
 *               message: "✅ 상품이 성공적으로 등록되었습니다."
 *               products:
 *                 id: 1
 *                 name: "샘플 상품"
 *                 productCode: "P-001"
 *                 brandId: 1
 *                 price: 10000
 *                 stockQuantity: 50
 *                 thumbnailImageUrl: "https://example.com/image.jpg"
 *                 detailDescription: "이 상품은 ..."
 *                 isSample: false
 *                 samplePrice: 1000
 *                 createdAt: "2024-07-28T12:00:00.000Z"
 *                 updatedAt: "2024-07-28T12:00:00.000Z"
 *       400:
 *         description: 잘못된 요청 (상품명과 가격은 필수)
 *       500:
 *         description: 서버 오류
 *   get:
 *     summary: 전체 상품 조회
 *     tags: [상품]
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ 상품이 성공적으로 조회되었습니다."
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                   example:
 *                     - id: 1
 *                       name: "샘플 상품"
 *                       productCode: "P-001"
 *                       brandId: 1
 *                       price: 10000
 *                       stockQuantity: 50
 *                       thumbnailImageUrl: "https://example.com/image.jpg"
 *                       detailDescription: "이 상품은 ..."
 *                       isSample: false
 *                       samplePrice: 1000
 *                       createdAt: "2024-07-28T12:00:00.000Z"
 *                       updatedAt: "2024-07-28T12:00:00.000Z"
 *       500:
 *         description: 서버 오류
 */
/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [상품]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *             example:
 *               message: "✅ 상품이 성공적으로 조회되었습니다."
 *               products:
 *                 id: 1
 *                 name: "샘플 상품"
 *                 productCode: "P-001"
 *                 brandId: 1
 *                 price: 10000
 *                 stockQuantity: 50
 *                 thumbnailImageUrl: "https://example.com/image.jpg"
 *                 detailDescription: "이 상품은 ..."
 *                 isSample: false
 *                 samplePrice: 1000
 *                 createdAt: "2024-07-28T12:00:00.000Z"
 *                 updatedAt: "2024-07-28T12:00:00.000Z"
 *       400:
 *         description: 잘못된 상품 ID
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */ 
