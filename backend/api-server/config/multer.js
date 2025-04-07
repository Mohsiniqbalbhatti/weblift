// config/multer.js
import multer from "multer";
import path from "path";
import { tmpdir } from "os";

export default multer({
  storage: multer.diskStorage({
    destination: tmpdir(),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
