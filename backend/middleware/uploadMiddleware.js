import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "passport_app",
    allowed_formats: ["jpg", "png"]
  }
});

 export const upload = multer({ storage });

