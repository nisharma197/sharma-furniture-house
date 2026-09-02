import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const inquirySchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(100).optional(),
  projectType: z.string().max(100).optional(),
  furnitureRequired: z.string().max(200).optional(),
  message: z.string().min(5).max(2000),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"]),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(160).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  description: z.string().min(10),
  materials: z.string().optional(),
  finish: z.string().optional(),
  features: z.array(z.string()).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const projectCategoryEnum = z.enum([
  "HOME",
  "VILLA",
  "APARTMENT",
  "HOSTEL",
  "HOTEL",
  "RESTAURANT",
  "CAFE",
  "SCHOOL",
  "COLLEGE",
  "COACHING_INSTITUTE",
  "HOSPITAL",
  "CLINIC",
  "OFFICE",
  "CORPORATE",
  "SHOP",
  "SHOWROOM",
  "COMMERCIAL",
  "OTHER",
]);

export const projectSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(160).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  category: projectCategoryEnum,
  location: z.string().optional(),
  completionDate: z.string().datetime().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        caption: z.string().optional(),
        sortOrder: z.number().int().optional(),
      })
    )
    .optional(),
});

export const galleryImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional().or(z.literal("")),
  caption: z.string().optional(),
  altText: z.string().optional(),
  category: z.string().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(2).max(100),
  location: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(5).max(1000),
  rating: z.number().int().min(1).max(5).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(3).max(300),
  answer: z.string().min(3),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
