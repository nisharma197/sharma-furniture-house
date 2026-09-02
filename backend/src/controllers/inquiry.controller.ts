import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { inquirySchema, inquiryStatusSchema, paginationSchema } from "../utils/validation";

// Public: visitor submits an inquiry
export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const data = inquirySchema.parse(req.body);
  const inquiry = await prisma.inquiry.create({
    data: { ...data, email: data.email || undefined },
  });
  res.status(201).json({ success: true, data: inquiry, message: "Thank you! We will contact you shortly." });
});

// Admin: list with search + filter + pagination
export const listInquiries = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, sortOrder } = paginationSchema.parse(req.query);
  const status = req.query.status as string | undefined;

  const where = {
    ...(status ? { status: status as any } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);

  res.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = inquiryStatusSchema.parse(req.body);
  const inquiry = await prisma.inquiry.update({ where: { id: req.params.id }, data: { status } }).catch(() => null);
  if (!inquiry) throw new ApiError(404, "Inquiry not found");
  res.json({ success: true, data: inquiry });
});

export const deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
  await prisma.inquiry.delete({ where: { id: req.params.id } }).catch(() => {
    throw new ApiError(404, "Inquiry not found");
  });
  res.json({ success: true, message: "Inquiry deleted" });
});

// Admin: export all inquiries as CSV
export const exportInquiries = asyncHandler(async (req: Request, res: Response) => {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  const header = ["Name", "Phone", "Email", "City", "Project Type", "Furniture Required", "Message", "Status", "Date"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = inquiries.map((i) =>
    [i.name, i.phone, i.email, i.city, i.projectType, i.furnitureRequired, i.message, i.status, i.createdAt.toISOString()]
      .map(escape)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=inquiries.csv");
  res.send(csv);
});
