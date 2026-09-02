import { Router } from "express";
import authRoutes from "./auth.routes";
import serviceRoutes from "./service.routes";
import projectRoutes from "./project.routes";
import galleryRoutes from "./gallery.routes";
import testimonialRoutes from "./testimonial.routes";
import inquiryRoutes from "./inquiry.routes";
import faqRoutes from "./faq.routes";
import uploadRoutes from "./upload.routes";
import settingsRoutes from "./settings.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/projects", projectRoutes);
router.use("/gallery", galleryRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/faqs", faqRoutes);
router.use("/admin", uploadRoutes);
router.use("/settings", settingsRoutes);

export default router;
