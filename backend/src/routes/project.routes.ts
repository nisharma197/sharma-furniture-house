import { Router } from "express";
import {
  listProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  deleteProjectImage,
  uploadProjectCoverImage,
} from "../controllers/project.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { upload } from "../lib/cloudinary";

const router = Router();

router.get("/", optionalAuth, listProjects);
router.get("/:slug", optionalAuth, getProjectBySlug);
router.post("/", requireAuth, createProject);
router.put("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);

// Upload cover image for a project (multipart/form-data)
router.post("/:id/cover-image", requireAuth, upload.single("image"), uploadProjectCoverImage);

// Upload additional images for a project (multipart/form-data)
router.post("/:id/images", requireAuth, upload.single("image"), addProjectImage);

// Delete a specific image from a project
router.delete("/:projectId/images/:imageId", requireAuth, deleteProjectImage);

export default router;
