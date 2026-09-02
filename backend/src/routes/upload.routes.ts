import { Router } from "express";
import { uploadImage, dashboardStats } from "../controllers/upload.controller";
import { requireAuth } from "../middleware/auth";
import { upload } from "../lib/cloudinary";

const router = Router();

router.post("/image", requireAuth, upload.single("image"), uploadImage);
router.get("/dashboard-stats", requireAuth, dashboardStats);

export default router;
