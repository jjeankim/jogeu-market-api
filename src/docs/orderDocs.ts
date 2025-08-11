/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주문 ID
 *           example: 1
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *           example: 1
 *         shippingAddressId:
 *           type: integer
 *           description: 배송지 ID
 *           example: 1
 *         paymentMethod:
 *           type: string
 *           description: 결제 방법
 *           example: "카드"
 *         paymentStatus:
 *           type: string
 *           enum: [결제대기, 결제완료, 결제실패]
 *           description: 결제 상태
 *           example: "결제대기"
 *         deliveryMessage:
 *           type: string
 *           description: 배송 메시지
 *           example: "문 앞에 놔주세요"
 *         totalAmount:
 *           type: number
 *           description: 총 금액
 *           example: 13000
 *         shippingFee:
 *           type: number
 *           description: 배송비
 *           example: 3000
 *         orderNumber:
 *           type: string
 *           description: 주문번호
 *           example: "ORD-1722153600000"
 *         isSample:
 *           type: boolean
 *           description: 샘플 주문 여부
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-28T12:00:00.000Z"
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주문 아이템 ID
 *           example: 1
 *         orderId:
 *           type: integer
 *           description: 주문 ID
 *           example: 1
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *           example: 1
 *         quantity:
 *           type: integer
 *           description: 수량
 *           example: 2
 *         priceAtPurchase:
 *           type: number
 *           description: 구매 시 가격
 *           example: 10000
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - shippingAddressId
 *         - paymentMethod
 *       properties:
 *         shippingAddressId:
 *           type: integer
 *           description: 배송지 ID (필수)
 *           example: 1
 *         paymentMethod:
 *           type: string
 *           description: 결제 방법 (필수)
 *           example: "카드"
 *         deliveryMessage:
 *           type: string
 *           description: 배송 메시지
 *           example: "문 앞에 놔주세요"
 *     UpdateOrderStatusRequest:
 *       type: object
 *       required:
 *         - paymentStatus
 *       properties:
 *         paymentStatus:
 *           type: string
 *           enum: [결제대기, 결제완료, 결제실패]
 *           description: 결제 상태 (필수)
 *           example: "결제완료"
 *     OrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "주문 생성 완료"
 *         data:
 *           $ref: '#/components/schemas/Order'
 *           example:
 *             id: 1
 *             userId: 1
 *             shippingAddressId: 1
 *             paymentMethod: "카드"
 *             paymentStatus: "결제대기"
 *             deliveryMessage: "문 앞에 놔주세요"
 *             totalAmount: 13000
 *             shippingFee: 3000
 *             orderNumber: "ORD-1722153600000"
 *             isSample: false
 *             createdAt: "2024-07-28T12:00:00.000Z"
 *             updatedAt: "2024-07-28T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: 주문 생성
 *     tags: [주문]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           example:
 *             shippingAddressId: 1
 *             paymentMethod: "카드"
 *             deliveryMessage: "문 앞에 놔주세요"
 *     responses:
 *       201:
 *         description: 주문 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *             example:
 *               message: "주문 생성 완료"
 *               data:
 *                 id: 1
 *                 userId: 1
 *                 shippingAddressId: 1
 *                 paymentMethod: "카드"
 *                 paymentStatus: "결제대기"
 *                 deliveryMessage: "문 앞에 놔주세요"
 *                 totalAmount: 13000
 *                 shippingFee: 3000
 *                 orderNumber: "ORD-1722153600000"
 *                 isSample: false
 *                 createdAt: "2024-07-28T12:00:00.000Z"
 *                 updatedAt: "2024-07-28T12:00:00.000Z"
 *       400:
 *         description: 장바구니가 비어있음
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   get:
 *     summary: 주문 목록 조회
 *     tags: [주문]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주문 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "주문 목록 조회에 성공했습니다."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                   example:
 *                     - id: 1
 *                       userId: 1
 *                       shippingAddressId: 1
 *                       paymentMethod: "카드"
 *                       paymentStatus: "결제대기"
 *                       deliveryMessage: "문 앞에 놔주세요"
 *                       totalAmount: 13000
 *                       shippingFee: 3000
 *                       orderNumber: "ORD-1722153600000"
 *                       isSample: false
 *                       createdAt: "2024-07-28T12:00:00.000Z"
 *                       updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 주문 목록을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: 주문 상세 조회
 *     tags: [주문]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     responses:
 *       200:
 *         description: 주문 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "주문 상세 조회 성공"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                   example:
 *                     id: 1
 *                     userId: 1
 *                     shippingAddressId: 1
 *                     paymentMethod: "카드"
 *                     paymentStatus: "결제대기"
 *                     deliveryMessage: "문 앞에 놔주세요"
 *                     totalAmount: 13000
 *                     shippingFee: 3000
 *                     orderNumber: "ORD-1722153600000"
 *                     isSample: false
 *                     createdAt: "2024-07-28T12:00:00.000Z"
 *                     updatedAt: "2024-07-28T12:00:00.000Z"
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 주문을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: 주문 상태 변경
 *     tags: [주문]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *           example:
 *             paymentStatus: "결제완료"
 *     responses:
 *       200:
 *         description: 주문 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "주문상태가 성공적으로 변경되었습니다."
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                   example:
 *                     id: 1
 *                     userId: 1
 *                     shippingAddressId: 1
 *                     paymentMethod: "카드"
 *                     paymentStatus: "결제완료"
 *                     deliveryMessage: "문 앞에 놔주세요"
 *                     totalAmount: 13000
 *                     shippingFee: 3000
 *                     orderNumber: "ORD-1722153600000"
 *                     isSample: false
 *                     createdAt: "2024-07-28T12:00:00.000Z"
 *                     updatedAt: "2024-07-28T12:00:00.000Z"
 *       400:
 *         description: 잘못된 요청 (유효하지 않은 주문 ID 또는 결제 상태)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 주문을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */ 