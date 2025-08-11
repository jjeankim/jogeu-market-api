"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = ({ page = 1, limit = 10, }) => {
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);
    const offset = (parsedPage - 1) * parsedLimit;
    return {
        page: parsedPage,
        limit: parsedLimit,
        offset,
    };
};
exports.getPagination = getPagination;
