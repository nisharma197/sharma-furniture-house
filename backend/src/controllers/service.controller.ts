import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { serviceSchema, paginationSchema } from "../utils/validation";

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = paginationSchema.parse(req.query);
  const isPublic = !req.admin;

  const where = {
    ...(isPublic ? { isActive: true } : {}),
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: { [sortBy || "sortOrder"]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.service.count({ where }),
  ]);

  res.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.findUnique({ where: { slug: req.params.slug } });
  if (!service || (!service.isActive && !req.admin)) throw new ApiError(404, "Service not found");
  res.json({ success: true, data: service });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const data = serviceSchema.parse(req.body);
  const existing = await prisma.service.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "A service with this slug already exists");
  const service = await prisma.service.create({ data });
  res.status(201).json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const data = serviceSchema.partial().parse(req.body);
  const service = await prisma.service.update({ where: { id: req.params.id }, data }).catch(() => null);
  if (!service) throw new ApiError(404, "Service not found");
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: req.params.id } }).catch(() => {
    throw new ApiError(404, "Service not found");
  });
  res.json({ success: true, message: "Service deleted" });
});

export const uploadServiceCoverImage = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as (Express.Multer.File & { path?: string; filename?: string }) | undefined;
  if (!file || !file.path) throw new ApiError(400, "No image file provided");

  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { coverImage: file.path },
    });
    res.json({ success: true, data: { url: file.path, publicId: file.filename, service } });
  } catch (err: any) {
    if (err.code === "P2025") throw new ApiError(404, "Service not found");
    throw err;
  }
});

