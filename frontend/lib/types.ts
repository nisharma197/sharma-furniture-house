export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  materials?: string | null;
  finish?: string | null;
  features: string[];
  coverImage?: string | null;
  images: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  publicId?: string | null;
  caption?: string | null;
  sortOrder?: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location?: string | null;
  completionDate?: string | null;
  coverImage?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  images: ProjectImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  publicId?: string | null;
  caption?: string | null;
  altText?: string | null;
  category?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location?: string | null;
  projectType?: string | null;
  message: string;
  rating: number;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  projectType?: string | null;
  furnitureRequired?: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Paginated<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SiteSettings {
  businessName?: string;
  ownerName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  mapEmbedUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
}
