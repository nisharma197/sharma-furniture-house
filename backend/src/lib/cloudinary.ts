import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "sharma-furniture-house",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1920, crop: "limit", quality: "auto" }],
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
});

export { cloudinary };
