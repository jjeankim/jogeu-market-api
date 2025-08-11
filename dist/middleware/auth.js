"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ message: "토큰이 없습니다." });
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(404).json({ message: "토큰이 없습니다." });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "토큰 만료" });
            }
            return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
        }
        req.user = user;
        next();
    });
};
exports.authenticateJWT = authenticateJWT;
