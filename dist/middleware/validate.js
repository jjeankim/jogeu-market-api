"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return res
                .status(400)
                .json({ message: "입력값이 잘못되었습니다.", errors });
        }
        req.body = result.data;
        next();
    };
};
exports.validateBody = validateBody;
