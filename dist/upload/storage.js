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
Object.defineProperty(exports, "__esModule", { value: true });
const multer_azure_blob_storage_1 = require("multer-azure-blob-storage");
if (!process.env.AZURE_STORAGE_ACCOUNT)
    throw new Error("AZURE_STORAGE_ACCOUNT missing");
if (!process.env.AZURE_STORAGE_ACCOUNT_KEY)
    throw new Error("AZURE_STORAGE_ACCOUNT_KEY missing");
if (!process.env.AZURE_STORAGE_CONTAINER)
    throw new Error("AZURE_STORAGE_CONTAINER missing");
const blobName = (req, file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ext = (_a = file.mimetype.split("/")[1]) !== null && _a !== void 0 ? _a : "bin"; // ← mimetype 오타 주의!
    const yyyy = new Date().getFullYear();
    const mm = String(new Date().getMonth() + 1).padStart(2, "0");
    return `${yyyy}/${mm}/${Date.now()}-${Math.trunc(Math.random() * 1e9)}.${ext}`;
});
const storage = new multer_azure_blob_storage_1.MulterAzureStorage({
    accountName: process.env.AZURE_STORAGE_ACCOUNT,
    accessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
    containerName: process.env.AZURE_STORAGE_CONTAINER,
    containerAccessLevel: "blob", // "private" | "blob" | "container"
    blobName, // ✅ fileName 대신 blobName 리졸버 사용
});
exports.default = storage;
