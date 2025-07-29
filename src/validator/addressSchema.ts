import { z } from "zod";

export const createAddressSchema = z.object({
  recipientName: z.string().min(1, "수령인 이름은 필수입니다."),
  recipientPhone: z.string().min(10, "전화번호는 필수입니다."),
  addressLine1: z.string().min(1, "주소1은 필수입니다"),
  addressLine2: z.string().optional(),
  postCode: z.string().min(1, "우편주소는 필수입니다."),
});

export const updateAddressSchema = z.object({
  recipientName: z.string().min(1, "수령인 이름은 필수입니다."),
  recipientPhone: z.string().min(10, "전화번호는 필수입니다."),
  addressLine1: z.string().min(1, "주소1은 필수입니다"),
  addressLine2: z.string().optional(),
  postCode: z.string().min(1, "우편주소는 필수입니다."),
});
