import multer from "multer";
import storage from "../upload/storage";

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const getSingleUploader = (fieldName: string) =>
  upload.single(fieldName);

export const getMultiUploader = (
  fields: { name: string; maxCount: number }[]
) => upload.fields(fields);
