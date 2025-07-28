/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReview:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 리뷰 ID
 *           example: 1
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *           example: 1
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *           example: 1
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: 평점 (1-5)
 *           example: 5
 *         title:
 *           type: string
 *           description: 리뷰 제목
 *           example: "아주 좋아요"
 *         content:
 *           type: string
 *           description: 리뷰 내용
 *           example: "정말 만족스러운 상품입니다."
 *         imageUrl:
 *           type: string
 *           description: 리뷰 이미지 URL
 *           example: "https://example.com/review.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - rating
 *         - title
 *         - content
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: 평점 (1-5, 필수)
 *           example: 5
 *         title:
 *           type: string
 *           description: 리뷰 제목 (필수)
 *           example: "아주 좋아요"
 *         content:
 *           type: string
 *           description: 리뷰 내용 (필수)
 *           example: "정말 만족스러운 상품입니다."
 *         imageUrl:
 *           type: string
 *           description: 리뷰 이미지 URL
 *           example: "https://example.com/review.jpg"
 *     UpdateReviewRequest:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: 평점 (1-5)
 *           example: 4
 *         title:
 *           type: string
 *           description: 리뷰 제목
 *           example: "좋아요"
 *         content:
 *           type: string
 *           description: 리뷰 내용
 *           example: "만족합니다."
 *         imageUrl:
 *           type: string
 *           description: 리뷰 이미지 URL
 *           example: "https://example.com/review2.jpg"
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "리뷰가 성공적으로 작성되었습니다."
 *         review:
 *           $ref: '#/components/schemas/ProductReview'
 *           example:
 *             id: 1
 *             productId: 1
 *             userId: 1
 *             rating: 5
 *             title: "아주 좋아요"
 *             content: "정말 만족스러운 상품입니다."
 *             imageUrl: "https://example.com/review.jpg"
 *             createdAt: "2024-07-28T12:00:00.000Z"
 *             updatedAt: "2024-07-28T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   get:
 *     summary: 상품 리뷰 조회
 *     tags: [상품 리뷰]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 리뷰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "리뷰 조회 성공"
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductReview'
 *       500:
 *         description: 서버 오류
 *   post:
 *     summary: 상품 리뷰 작성
 *     tags: [상품 리뷰]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: 리뷰 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/products/{id}/reviews/{reviewId}:
 *   put:
 *     summary: 상품 리뷰 수정
 *     tags: [상품 리뷰]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       200:
 *         description: 리뷰 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *   delete:
 *     summary: 상품 리뷰 삭제
 *     tags: [상품 리뷰]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "리뷰가 성공적으로 삭제되었습니다."
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */ 