import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

const app = express();
const rootPath = path.resolve(__dirname, "../..");
export const uploadPath = path.join(rootPath, "public", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

app.use("/uploads", express.static(uploadPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.trunc(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 필드네임만 넘겨 여러곳에서 재사용 가능
export const getSingleUploader = (fieldName: string) =>
  upload.single(fieldName);
