"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    recipientName: zod_1.z.string().min(1, "수령인 이름은 필수입니다."),
    recipientPhone: zod_1.z.string().min(10, "전화번호는 필수입니다."),
    addressLine1: zod_1.z.string().min(1, "주소1은 필수입니다"),
    addressLine2: zod_1.z.string().optional(),
    postCode: zod_1.z.string().min(1, "우편주소는 필수입니다."),
});
exports.updateAddressSchema = zod_1.z.object({
    recipientName: zod_1.z.string().min(1, "수령인 이름은 필수입니다."),
    recipientPhone: zod_1.z.string().min(10, "전화번호는 필수입니다."),
    addressLine1: zod_1.z.string().min(1, "주소1은 필수입니다"),
    addressLine2: zod_1.z.string().optional(),
    postCode: zod_1.z.string().min(1, "우편주소는 필수입니다."),
});
