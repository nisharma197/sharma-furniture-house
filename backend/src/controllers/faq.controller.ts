import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { faqSchema } from "../utils/validation";

export const listFaqs = asyncHandler(async (req: Request, res: Response) => {
  const isPublic = !req.admin;
  const items = await prisma.faqItem.findMany({
    where: isPublic ? { isActive: true } : {},
    orderBy: { sortOrder: "asc" },
  });
  res.json({ success: true, data: items });
});

export const createFaq = asyncHandler(async (req: Request, res: Response) => {
  const data = faqSchema.parse(req.body);
  const faq = await prisma.faqItem.create({ data });
  res.status(201).json({ success: true, data: faq });
});

export const updateFaq = asyncHandler(async (req: Request, res: Response) => {
  const data = faqSchema.partial().parse(req.body);
  const faq = await prisma.faqItem.update({ where: { id: req.params.id }, data }).catch(() => null);
  if (!faq) throw new ApiError(404, "FAQ not found");
  res.json({ success: true, data: faq });
});

export const deleteFaq = asyncHandler(async (req: Request, res: Response) => {
  await prisma.faqItem.delete({ where: { id: req.params.id } }).catch(() => {
    throw new ApiError(404, "FAQ not found");
  });
  res.json({ success: true, message: "FAQ deleted" });
});
