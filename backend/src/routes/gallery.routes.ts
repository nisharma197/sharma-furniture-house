import { Router } from "express";
import {
  listGalleryImages,
  uploadGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/gallery.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { upload } from "../lib/cloudinary";

const router = Router();

// Public: list gallery images (with optional auth to see inactive)
router.get("/", optionalAuth, listGalleryImages);

// Admin: upload image file + create DB record atomically (multipart/form-data)
router.post("/upload", requireAuth, upload.single("image"), uploadGalleryImage);

// Admin: create record from existing URL (JSON body)
router.post("/", requireAuth, createGalleryImage);

// Admin: update metadata
router.put("/:id", requireAuth, updateGalleryImage);

// Admin: delete
router.delete("/:id", requireAuth, deleteGalleryImage);

export default router;
