"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const token_1 = require("../utils/token");
const oauthRouter = express_1.default.Router();
// 카카오 로그인
oauthRouter.post("/kakao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { code } = req.body; // 프론트에서 authorization_code 받음
    try {
        // 1. 카카오 토큰 발급
        const tokenRes = yield axios_1.default.post("https://kauth.kakao.com/oauth/token", new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_CLIENT_ID,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const { access_token } = tokenRes.data;
        // 2. 사용자 정보 요청
        const userRes = yield axios_1.default.get("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const kakaoUser = userRes.data;
        const kakaoId = String(kakaoUser.id);
        const email = (_b = (_a = kakaoUser.kakao_account) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : null;
        const name = ((_d = (_c = kakaoUser.kakao_account) === null || _c === void 0 ? void 0 : _c.profile) === null || _d === void 0 ? void 0 : _d.nickname) || "카카오유저";
        // 3. DB 유저 조회 or 생성
        let user = yield prisma_1.default.user.findUnique({
            where: {
                provider_providerId: { provider: "kakao", providerId: kakaoId },
            },
        });
        if (!user) {
            user = yield prisma_1.default.user.create({
                data: {
                    email,
                    name,
                    provider: "kakao",
                    providerId: kakaoId,
                },
            });
        }
        // 4. JWT Payload 매핑
        const payload = Object.assign({ id: user.id, name: user.name, provider: (_e = user.provider) !== null && _e !== void 0 ? _e : "kakao", providerId: (_f = user.providerId) !== null && _f !== void 0 ? _f : kakaoId }, (user.email ? { email: user.email } : {}));
        // 5. 토큰 발급
        const accessToken = (0, token_1.generateAccessToken)(payload);
        const refreshToken = (0, token_1.generateRefreshToken)({
            id: payload.id,
            provider: payload.provider,
            providerId: payload.providerId,
        });
        // 6. refreshToken 쿠키 저장
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.json({ accessToken, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "카카오 로그인 실패" });
    }
}));
// 네이버 로그인
oauthRouter.post("/naver", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { code, state } = req.body;
    try {
        // 1. 네이버 토큰 요청
        const tokenRes = yield axios_1.default.post("https://nid.naver.com/oauth2.0/token", null, {
            params: {
                grant_type: "authorization_code",
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                code,
                state,
            },
        });
        const { access_token } = tokenRes.data;
        // 2. 사용자 정보 요청
        const userRes = yield axios_1.default.get("https://openapi.naver.com/v1/nid/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const naverUser = userRes.data.response;
        const naverId = String(naverUser.id);
        const email = (_a = naverUser.email) !== null && _a !== void 0 ? _a : null;
        const name = (_b = naverUser.nickname) !== null && _b !== void 0 ? _b : "네이버유저";
        // 3. DB 유저 조회 or 생성
        let user = yield prisma_1.default.user.findUnique({
            where: { provider_providerId: { provider: "naver", providerId: naverId } },
        });
        if (!user) {
            user = yield prisma_1.default.user.create({
                data: {
                    email,
                    name,
                    provider: "naver",
                    providerId: naverId,
                },
            });
        }
        // 4. JWT Payload 매핑
        const payload = Object.assign({ id: user.id, name: user.name, provider: (_c = user.provider) !== null && _c !== void 0 ? _c : "naver", providerId: (_d = user.providerId) !== null && _d !== void 0 ? _d : naverId }, (user.email ? { email: user.email } : {}));
        // 5. 토큰 발급
        const accessToken = (0, token_1.generateAccessToken)(payload);
        const refreshToken = (0, token_1.generateRefreshToken)({
            id: payload.id,
            provider: payload.provider,
            providerId: payload.providerId,
        });
        // 6. refreshToken 쿠키 저장
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.json({ accessToken, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "네이버 로그인 실패" });
    }
}));
exports.default = oauthRouter;
