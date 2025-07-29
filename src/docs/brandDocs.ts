/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 브랜드 ID
 *           example: 1
 *         name:
 *           type: string
 *           description: 브랜드명
 *           example: "나이키"
 *         description:
 *           type: string
 *           description: 브랜드 설명
 *           example: "스포츠 브랜드"
 *         logoUrl:
 *           type: string
 *           description: 브랜드 로고 URL
 *           example: "https://example.com/logo.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *     CreateBrandRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: 브랜드명 (필수)
 *           example: "나이키"
 *         description:
 *           type: string
 *           description: 브랜드 설명
 *           example: "스포츠 브랜드"
 *         logoUrl:
 *           type: string
 *           description: 브랜드 로고 URL
 *           example: "https://example.com/logo.png"
 *     BrandResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "브랜드가 성공적으로 등록되었습니다."
 *         brand:
 *           $ref: '#/components/schemas/Brand'
 *           example:
 *             id: 1
 *             name: "나이키"
 *             description: "스포츠 브랜드"
 *             logoUrl: "https://example.com/logo.png"
 *             createdAt: "2024-07-28T12:00:00.000Z"
 *             updatedAt: "2024-07-28T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/brand:
 *   post:
 *     summary: 브랜드 등록
 *     tags: [브랜드]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBrandRequest'
 *           example:
 *             name: "나이키"
 *             description: "스포츠 브랜드"
 *             logoUrl: "https://example.com/logo.png"
 *     responses:
 *       201:
 *         description: 브랜드 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandResponse'
 *             example:
 *               message: "브랜드가 성공적으로 등록되었습니다."
 *               brand:
 *                 id: 1
 *                 name: "나이키"
 *                 description: "스포츠 브랜드"
 *                 logoUrl: "https://example.com/logo.png"
 *                 createdAt: "2024-07-28T12:00:00.000Z"
 *                 updatedAt: "2024-07-28T12:00:00.000Z"
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 *   get:
 *     summary: 전체 브랜드 조회
 *     tags: [브랜드]
 *     responses:
 *       200:
 *         description: 브랜드 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "브랜드 목록 조회 성공"
 *                 brands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *                   example:
 *                     - id: 1
 *                       name: "나이키"
 *                       description: "스포츠 브랜드"
 *                       logoUrl: "https://example.com/logo.png"
 *                       createdAt: "2024-07-28T12:00:00.000Z"
 *                       updatedAt: "2024-07-28T12:00:00.000Z"
 *       500:
 *         description: 서버 오류
 */ 