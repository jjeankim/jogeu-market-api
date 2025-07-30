import multer from "multer";
import storage from "./storage";

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const getSingleUploader = (fieldName: string) =>
  upload.single(fieldName);
