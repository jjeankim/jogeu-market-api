import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const router = express.Router();

router.post("/auth/kakao", async (req, res) => {
  const { code } = req.body; // 프론트에서 authorization_code 받음

  try {
    // 1. 카카오 토큰 발급
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // 2. 사용자 정보 요청
    const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoUser = userRes.data;
    const kakaoId = String(kakaoUser.id);
    const email = kakaoUser.kakao_account?.email || null;
    const name = kakaoUser.kakao_account?.profile?.nickname || "카카오유저";

    // 3. DB 유저 조회 or 생성
    let user = await prisma.user.findUnique({
      where: {
        provider_providerId: { provider: "kakao", providerId: kakaoId },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          provider: "kakao",
          providerId: kakaoId,
        },
      });
    }

    // 4. JWT 발급
    const token = jwt.sign(
      { id: user.id, provider: user.provider },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "카카오 로그인 실패" });
  }
});

export default router;
