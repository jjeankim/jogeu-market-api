"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *         name:
 *           type: string
 *           description: 사용자 이름
 *         phoneNumber:
 *           type: string
 *           description: 전화번호
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *           example: "test@example.com"
 *         password:
 *           type: string
 *           description: 비밀번호
 *           example: "test1234"
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - phoneNumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *           example: "test@example.com"
 *         password:
 *           type: string
 *           description: 비밀번호
 *           example: "test1234"
 *         name:
 *           type: string
 *           description: 사용자 이름
 *           example: "홍길동"
 *         phoneNumber:
 *           type: string
 *           description: 전화번호
 *           example: "010-1234-5678"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT 토큰
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "회원가입 완료"
 *         userId:
 *           type: integer
 *           description: 생성된 사용자 ID
 *           example: 1
 */
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [인증]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           example:
 *             email: "test@example.com"
 *             password: "test1234"
 *             name: "홍길동"
 *             phoneNumber: "010-1234-5678"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 *             example:
 *               message: "회원가입 완료"
 *               userId: 1
 *       400:
 *         description: 잘못된 요청 (모든 필드를 입력해주세요)
 *       409:
 *         description: 이미 존재하는 메일입니다
 *       500:
 *         description: 서버 오류
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [인증]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "test@example.com"
 *             password: "test1234"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 잘못된 요청 (이메일과 비밀번호를 입력해주세요)
 *       401:
 *         description: 인증 실패 (이메일 또는 비밀번호가 틀렸습니다)
 *       500:
 *         description: 서버 오류
 */ 
