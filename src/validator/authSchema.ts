import * as z from "zod";

const signupSchema = z.object({
  email: z.email({ message: "유효한 이메일 주소를 입력하세요." }),
  password: z
    .string()
    .trim()
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
    .max(20, "비밀번호는 최대 20자 이하어야 합니다.")
    .regex(/[A-Z]/, "비밀번호는 최소 하나의 대문자가 포함되어야 합니다.")
    .regex(
      /[^A-Za-z0-9]/,
      "비밀번호는 최소 하나의 특수문자가 포함되어야 합니다."
    ),
  username: z
    .string()
    .trim()
    .min(2, "이름은 최소 2자리 이상이어야 합니다.")
    .max(10, "이름은 최대 10자리 이하여야 합니다."),
});
