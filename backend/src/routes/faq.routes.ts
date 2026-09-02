import { Router } from "express";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "../controllers/faq.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, listFaqs);
router.post("/", requireAuth, createFaq);
router.put("/:id", requireAuth, updateFaq);
router.delete("/:id", requireAuth, deleteFaq);

export default router;
