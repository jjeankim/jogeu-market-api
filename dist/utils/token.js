"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const refreshToken = jsonwebtoken_1.default.sign({
        id: user.id,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
