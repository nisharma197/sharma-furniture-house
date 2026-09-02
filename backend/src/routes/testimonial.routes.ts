import { Router } from "express";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, listTestimonials);
router.post("/", requireAuth, createTestimonial);
router.put("/:id", requireAuth, updateTestimonial);
router.delete("/:id", requireAuth, deleteTestimonial);

export default router;
