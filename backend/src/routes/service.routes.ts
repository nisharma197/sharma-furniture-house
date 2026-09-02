import { Router } from "express";
import {
  listServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  uploadServiceCoverImage,
} from "../controllers/service.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { upload } from "../lib/cloudinary";

const router = Router();

router.get("/", optionalAuth, listServices);
router.get("/:slug", optionalAuth, getServiceBySlug);
router.post("/", requireAuth, createService);
router.put("/:id", requireAuth, updateService);
router.delete("/:id", requireAuth, deleteService);

// Upload cover image for a service (multipart/form-data)
router.post("/:id/cover-image", requireAuth, upload.single("image"), uploadServiceCoverImage);

export default router;
