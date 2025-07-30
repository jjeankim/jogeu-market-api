import multer from "multer";
import path from "path";
import fs from "fs";

// 현재는 로컬 디스크 저장
const uploadPath = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

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

export default storage;
export { uploadPath };



// 추후 애저로 변경할때
// import { AzureStorage } from "multer-azure-blob-storage";

// const storage = new AzureStorage({
//   connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
//   accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
//   accountName: process.env.AZURE_ACCOUNT_NAME,
//   containerName: "uploads",
//   containerAccessLevel: "blob",
// });

// export default storage;
