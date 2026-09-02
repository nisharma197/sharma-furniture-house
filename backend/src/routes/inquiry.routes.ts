import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createInquiry,
  listInquiries,
  updateInquiryStatus,
  deleteInquiry,
  exportInquiries,
} from "../controllers/inquiry.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Stricter limit on public inquiry submission to deter spam/abuse
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: "Too many inquiries submitted. Please try again later." },
});

router.post("/", inquiryLimiter, createInquiry);
router.get("/", requireAuth, listInquiries);
router.get("/export", requireAuth, exportInquiries);
router.patch("/:id/status", requireAuth, updateInquiryStatus);
router.delete("/:id", requireAuth, deleteInquiry);

export default router;
