"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, _next) => {
    var _a, _b;
    const status = (_a = err.status) !== null && _a !== void 0 ? _a : 500;
    const message = (_b = err.message) !== null && _b !== void 0 ? _b : "Server Error";
    if (process.env.NODE_ENV !== "production")
        console.error(err);
    res.status(status).json(Object.assign({ message }, (process.env.NODE_ENV !== "production" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
