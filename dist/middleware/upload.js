"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultiUploader = exports.getSingleUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const storage_1 = __importDefault(require("../upload/storage"));
const upload = (0, multer_1.default)({
    storage: storage_1.default,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
const getSingleUploader = (fieldName) => upload.single(fieldName);
exports.getSingleUploader = getSingleUploader;
const getMultiUploader = (fields) => upload.fields(fields);
exports.getMultiUploader = getMultiUploader;
