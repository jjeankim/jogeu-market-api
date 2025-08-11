"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const z = __importStar(require("zod"));
exports.signupSchema = z.object({
    email: z.email({ message: "유효한 이메일 주소를 입력하세요." }),
    password: z
        .string()
        .trim()
        .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
    // .max(20, "비밀번호는 최대 20자 이하어야 합니다.")
    // .regex(/[A-Z]/, "비밀번호는 최소 하나의 대문자가 포함되어야 합니다.")
    // .regex(
    //   /[^A-Za-z0-9]/,
    //   "비밀번호는 최소 하나의 특수문자가 포함되어야 합니다."
    // )
    ,
    name: z
        .string()
        .trim()
        .min(2, "이름은 최소 2자리 이상이어야 합니다.")
        .max(10, "이름은 최대 10자리 이하여야 합니다."),
});
exports.loginSchema = z.object({
    email: z.email({ message: "유효한 이메일 주소를 입력하세요." }),
    password: z
        .string()
        .trim()
        .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
        .max(20, "비밀번호는 최대 20자 이하어야 합니다.")
    // .regex(/[A-Z]/, "비밀번호는 최소 하나의 대문자가 포함되어야 합니다.")
    // .regex(
    //   /[^A-Za-z0-9]/,
    //   "비밀번호는 최소 하나의 특수문자가 포함되어야 합니다."
    // ),
});
