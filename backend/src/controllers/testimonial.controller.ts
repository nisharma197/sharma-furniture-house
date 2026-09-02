import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { testimonialSchema, paginationSchema } from "../utils/validation";

export const listTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sortOrder } = paginationSchema.parse(req.query);
  const isPublic = !req.admin;
  const where = isPublic ? { isActive: true } : {};

  const [items, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.testimonial.count({ where }),
  ]);

  res.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const data = testimonialSchema.parse(req.body);
  const testimonial = await prisma.testimonial.create({ data });
  res.status(201).json({ success: true, data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const data = testimonialSchema.partial().parse(req.body);
  const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data }).catch(() => null);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  res.json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } }).catch(() => {
    throw new ApiError(404, "Testimonial not found");
  });
  res.json({ success: true, message: "Testimonial deleted" });
});
