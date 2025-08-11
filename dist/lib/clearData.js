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
const prisma_1 = __importDefault(require("./prisma"));
function clearData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 기존 데이터 삭제 (순서 중요: 외래키 제약조건 때문에)
            yield prisma_1.default.product.deleteMany({});
            yield prisma_1.default.brand.deleteMany({});
            console.log("✅ 기존 데이터 삭제 완료!");
        }
        catch (error) {
            console.error("❌ 데이터 삭제 에러:", error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
clearData();
