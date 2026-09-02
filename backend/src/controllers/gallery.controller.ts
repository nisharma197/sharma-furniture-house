import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { galleryImageSchema, paginationSchema } from "../utils/validation";

// Helper to clean empty string values to null
const cleanString = (val?: string | null): string | null => {
  if (val === undefined || val === null) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
};

// GET /api/gallery
// Public list with pagination, category filter, and optional admin override for inactive items
export const listGalleryImages = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortOrder } = paginationSchema.parse(req.query);
  const isPublic = !req.admin;
  const category = req.query.category as string | undefined;
  const featured = req.query.featured as string | undefined;

  const where: any = {
    ...(isPublic ? { isActive: true } : {}),
    ...(category && category.trim() !== "" ? { category: category.trim() } : {}),
    ...(featured === "true" ? { isFeatured: true } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.galleryImage.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: sortOrder }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.galleryImage.count({ where }),
  ]);

  res.json({
    success: true,
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// POST /api/gallery/upload  —  multipart/form-data
// Atomic endpoint: Multer + Cloudinary upload runs first, then Prisma creates DB record
export const uploadGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as (Express.Multer.File & { path?: string; filename?: string }) | undefined;

  if (!file) {
    throw new ApiError(400, "No image file provided. Please upload an image file using field name 'image'.");
  }

  const cloudinaryUrl = file.path;
  const publicId = file.filename;

  if (!cloudinaryUrl) {
    throw new ApiError(500, "Cloudinary upload failed. Check server Cloudinary credentials.");
  }

  const title = cleanString(req.body.title as string | undefined);
  const category = cleanString(req.body.category as string | undefined);
  const altText = cleanString(req.body.altText as string | undefined);
  const isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
  const sortOrder = req.body.sortOrder ? parseInt(req.body.sortOrder as string, 10) : 0;

  const galleryData: any = {
    url: cloudinaryUrl,
    publicId: publicId || null,
    caption: title || altText || null,
    altText: altText || title || null,
    category,
    isFeatured,
    sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
    isActive: true,
  };

  try {
    const image = await (prisma.galleryImage as any).create({
      data: galleryData,
    });

    res.status(201).json({
      success: true,
      message: "Gallery image uploaded and saved successfully.",
      data: image,
    });
  } catch (err: any) {
    throw new ApiError(500, `Failed to save gallery image to database: ${err.message || "Database error"}`);
  }
});

// POST /api/gallery (JSON body)
export const createGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const parsed = galleryImageSchema.parse(req.body);

  const galleryData: any = {
    url: parsed.url,
    publicId: cleanString(parsed.publicId),
    caption: cleanString(parsed.caption),
    altText: cleanString(parsed.altText),
    category: cleanString(parsed.category),
    isFeatured: parsed.isFeatured ?? false,
    sortOrder: parsed.sortOrder ?? 0,
    isActive: parsed.isActive ?? true,
  };

  try {
    const image = await (prisma.galleryImage as any).create({ data: galleryData });
    res.status(201).json({ success: true, data: image });
  } catch (err: any) {
    throw new ApiError(400, `Failed to create gallery image: ${err.message || "Database error"}`);
  }
});

// PUT /api/gallery/:id
export const updateGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const parsed = galleryImageSchema.partial().parse(req.body);

  const data: Record<string, any> = {};
  if (parsed.url !== undefined) data.url = parsed.url;
  if (parsed.publicId !== undefined) data.publicId = cleanString(parsed.publicId);
  if (parsed.caption !== undefined) data.caption = cleanString(parsed.caption);
  if (parsed.altText !== undefined) data.altText = cleanString(parsed.altText);
  if (parsed.category !== undefined) data.category = cleanString(parsed.category);
  if (parsed.isFeatured !== undefined) data.isFeatured = parsed.isFeatured;
  if (parsed.sortOrder !== undefined) data.sortOrder = parsed.sortOrder;
  if (parsed.isActive !== undefined) data.isActive = parsed.isActive;

  try {
    const image = await (prisma.galleryImage as any).update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: image });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new ApiError(404, "Gallery image not found");
    }
    throw new ApiError(400, `Failed to update gallery image: ${err.message || "Database error"}`);
  }
});

// DELETE /api/gallery/:id
export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Gallery image deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new ApiError(404, "Gallery image not found");
    }
    throw new ApiError(400, `Failed to delete gallery image: ${err.message || "Database error"}`);
  }
});
