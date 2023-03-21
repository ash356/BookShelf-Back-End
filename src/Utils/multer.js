import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  file: ["application/pdf", "application/msword"],
};
const __direname = path.dirname(fileURLToPath(import.meta.url));
export const fileUpload = (customPath = "general", customValidation = []) => {
  const fullPath = path.join(__direname, `../../uploads/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const suffixName = nanoid() + "-" + file.originalname;
      file.dist = `../../uploads/${customPath}/${suffixName}`;
      cb(null, suffixName);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("In-Valid File", { cause: 400 }), false);
    }
  };
  const limits = { fileSize: 1000000 }; // Size 1 MB
  const upload = multer({ fileFilter, storage, limits });
  return upload;
};
