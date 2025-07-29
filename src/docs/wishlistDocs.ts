/**
 * @swagger
 * components:
 *   schemas:
 *     Wishlist:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 위시리스트 ID
 *           example: 1
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *           example: 1
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *     CreateWishlistRequest:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: integer
 *           description: 상품 ID (필수)
 *           example: 1
 *     WishlistResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "위시리스트에 추가되었습니다."
 *         wishlist:
 *           $ref: '#/components/schemas/Wishlist'
 *           example:
 *             id: 1
 *             userId: 1
 *             productId: 1
 *             createdAt: "2024-07-28T12:00:00.000Z"
 *             updatedAt: "2024-07-28T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: 위시리스트에 상품 추가
 *     tags: [위시리스트]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWishlistRequest'
 *           example:
 *             productId: 1
 *     responses:
 *       201:
 *         description: 위시리스트 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *             example:
 *               message: "위시리스트에 추가되었습니다."
 *               wishlist:
 *                 id: 1
 *                 userId: 1
 *                 productId: 1
 *                 createdAt: "2024-07-28T12:00:00.000Z"
 *                 updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   get:
 *     summary: 위시리스트 조회
 *     tags: [위시리스트]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 위시리스트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "위시리스트 조회 성공"
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wishlist'
 *                   example:
 *                     - id: 1
 *                       userId: 1
 *                       productId: 1
 *                       createdAt: "2024-07-28T12:00:00.000Z"
 *                       updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: 위시리스트에서 상품 삭제
 *     tags: [위시리스트]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 위시리스트 ID
 *     responses:
 *       200:
 *         description: 위시리스트 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "위시리스트에서 삭제되었습니다."
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */ 