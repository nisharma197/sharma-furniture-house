import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { projectSchema, paginationSchema } from "../utils/validation";

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, sortOrder } = paginationSchema.parse(req.query);
  const isPublic = !req.admin;
  const category = req.query.category as string | undefined;
  const featured = req.query.featured as string | undefined;

  const where = {
    ...(isPublic ? { isActive: true } : {}),
    ...(category ? { category: category as any } : {}),
    ...(featured === "true" ? { isFeatured: true } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);

  res.json({
    success: true,
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project || (!project.isActive && !req.admin)) throw new ApiError(404, "Project not found");
  res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const data = projectSchema.parse(req.body);
  const { images, completionDate, ...rest } = data;

  const existing = await prisma.project.findUnique({ where: { slug: rest.slug } });
  if (existing) throw new ApiError(409, "A project with this slug already exists");

  const project = await prisma.project.create({
    data: {
      ...rest,
      completionDate: completionDate ? new Date(completionDate) : undefined,
      images: images && images.length > 0 ? { create: images } : undefined,
    },
    include: { images: true },
  });
  res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const data = projectSchema.partial().parse(req.body);
  const { images, completionDate, ...rest } = data;

  if (rest.slug) {
    const existing = await prisma.project.findFirst({
      where: { slug: rest.slug, NOT: { id: req.params.id } },
    });
    if (existing) throw new ApiError(409, "A project with this slug already exists");
  }

  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        completionDate: completionDate ? new Date(completionDate) : undefined,
        ...(images ? { images: { deleteMany: {}, create: images } } : {}),
      },
      include: { images: true },
    });
    res.json({ success: true, data: project });
  } catch (err: any) {
    if (err.code === "P2025") throw new ApiError(404, "Project not found");
    throw err;
  }
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") throw new ApiError(404, "Project not found");
    throw err;
  }
});

// Upload cover image for a project (multipart/form-data)
import { uploadToCloudinary } from "../lib/cloudinary";

export const uploadProjectCoverImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) throw new ApiError(400, "No image file provided");

  try {
    const result = await uploadToCloudinary(req.file.buffer, "sharma-furniture-house/projects");
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { coverImage: result.secure_url },
    });
    res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id, project } });
  } catch (err: any) {
    if (err.code === "P2025") throw new ApiError(404, "Project not found");
    throw new ApiError(500, `Cloudinary upload failed: ${err.message}`);
  }
});

// Add image to a project's gallery
export const addProjectImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) throw new ApiError(400, "No image file provided");

  // Verify project exists
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) throw new ApiError(404, "Project not found");

  const caption = (req.body.caption as string | undefined)?.trim() || null;
  const sortOrder = req.body.sortOrder ? parseInt(req.body.sortOrder as string, 10) : 0;

  try {
    const result = await uploadToCloudinary(req.file.buffer, "sharma-furniture-house/projects");
    const image = await prisma.projectImage.create({
      data: {
        projectId: req.params.id,
        url: result.secure_url,
        publicId: result.public_id,
        caption,
        sortOrder,
      },
    });
    res.status(201).json({ success: true, data: image });
  } catch (err: any) {
    throw new ApiError(500, `Image upload failed: ${err.message}`);
  }
});

// Delete a project image
export const deleteProjectImage = asyncHandler(async (req: Request, res: Response) => {
  try {
    await prisma.projectImage.delete({
      where: { id: req.params.imageId },
    });
    res.json({ success: true, message: "Image deleted" });
  } catch (err: any) {
    if (err.code === "P2025") throw new ApiError(404, "Image not found");
    throw err;
  }
});
