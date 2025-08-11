"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     UserInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *           example: "test@example.com"
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: 현재 비밀번호 (필수)
 *           example: "oldpass123"
 *         newPassword:
 *           type: string
 *           description: 새 비밀번호 (필수)
 *           example: "newpass456"
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *           example: "test@example.com"
 *     PasswordUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "비밀번호가 변경되었습니다."
 */
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               id: 1
 *               email: "test@example.com"
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *           example:
 *             currentPassword: "oldpass123"
 *             newPassword: "newpass456"
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PasswordUpdateResponse'
 *             example:
 *               message: "비밀번호가 변경되었습니다."
 *       400:
 *         description: 잘못된 요청 (현재 비밀번호와 새 비밀번호를 모두 입력해주세요)
 *       401:
 *         description: 인증 실패 또는 현재 비밀번호가 일치하지 않음
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */ 
