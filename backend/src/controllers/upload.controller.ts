import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";

// Handles a single image upload via multer + Cloudinary storage engine.
// Route wires: uploadSingle.single("image") middleware runs before this.
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File & { path?: string; filename?: string };
  if (!file) throw new ApiError(400, "No image file provided");

  res.status(201).json({
    success: true,
    data: {
      url: file.path, // Cloudinary secure URL
      publicId: file.filename,
    },
  });
});

export const dashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [services, projects, galleryImages, testimonials, totalInquiries, newInquiries] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.galleryImage.count(),
    prisma.testimonial.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  res.json({
    success: true,
    data: { services, projects, galleryImages, testimonials, totalInquiries, newInquiries },
  });
});
