"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_ORIGIN = exports.AZURE_STORAGE_CONTAINER = exports.AZURE_STORAGE_ACCOUNT_KEY = exports.AZURE_STORAGE_ACCOUNT = void 0;
require("dotenv/config");
exports.AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
exports.AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
exports.AZURE_STORAGE_CONTAINER = process.env.AZURE_STORAGE_CONTAINER;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
