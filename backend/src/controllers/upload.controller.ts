import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";

import { uploadToCloudinary } from "../lib/cloudinary";

// Handles a single image upload via multer (memory storage).
// Route wires: upload.single("image") middleware runs before this.
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) throw new ApiError(400, "No image file provided");

  try {
    const result = await uploadToCloudinary(req.file.buffer, "sharma-furniture-house/general");
    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error: any) {
    throw new ApiError(500, `Image upload failed: ${error.message}`);
  }
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
