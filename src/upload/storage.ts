import { MASNameResolver, MulterAzureStorage } from "multer-azure-blob-storage";
import {
  AZURE_STORAGE_ACCOUNT,
  AZURE_STORAGE_ACCOUNT_KEY,
  AZURE_STORAGE_CONTAINER,
} from "../config/env";

if (!AZURE_STORAGE_ACCOUNT) throw new Error("AZURE_STORAGE_ACCOUNT missing");
if (!AZURE_STORAGE_ACCOUNT_KEY)
  throw new Error("AZURE_STORAGE_ACCOUNT_KEY missing");
if (!AZURE_STORAGE_CONTAINER)
  throw new Error("AZURE_STORAGE_CONTAINER missing");

const blobName: MASNameResolver = async (req, file) => {
  const ext = file.mimetype.split("/")[1] ?? "bin"; // ← mimetype 오타 주의!
  const yyyy = new Date().getFullYear();
  const mm = String(new Date().getMonth() + 1).padStart(2, "0");
  return `${yyyy}/${mm}/${Date.now()}-${Math.trunc(
    Math.random() * 1e9
  )}.${ext}`;
};

const storage = new MulterAzureStorage({
  accountName: AZURE_STORAGE_ACCOUNT!,
  accessKey: AZURE_STORAGE_ACCOUNT_KEY!,
  containerName: AZURE_STORAGE_CONTAINER,
  containerAccessLevel: "blob", // "private" | "blob" | "container"
  blobName, // ✅ fileName 대신 blobName 리졸버 사용
});

export default storage;
