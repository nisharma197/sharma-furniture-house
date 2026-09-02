import { authStorage } from "./auth";
import type {
  ApiResponse,
  Paginated,
  Project,
  Service,
  GalleryImage,
  Testimonial,
  FaqItem,
  Inquiry,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const authToken = token || (typeof window !== "undefined" ? authStorage.get() : null);

  // Detect if body is FormData — DO NOT set Content-Type manually in that case.
  // The browser will set the correct multipart/form-data boundary automatically.
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    body,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return json as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};

// ─── Gallery ────────────────────────────────────────────────────────────────
/** Upload image file + metadata to backend in one atomic request.
 *  Uses multipart/form-data so multer + Cloudinary run, then DB record is created. */
export function uploadGalleryImage(formData: FormData) {
  const token = typeof window !== "undefined" ? authStorage.get() : null;
  return api.post<ApiResponse<GalleryImage>>("/gallery/upload", formData, {
    token: token || undefined,
  });
}

export const getGallery = (params?: { category?: string; featured?: boolean; limit?: number; page?: number }) => {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.featured) query.set("featured", "true");
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.page) query.set("page", params.page.toString());
  const qStr = query.toString();
  return api.get<Paginated<GalleryImage>>(`/gallery${qStr ? `?${qStr}` : ""}`);
};

// ─── Projects ───────────────────────────────────────────────────────────────
export const getProjects = (params?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.featured) query.set("featured", "true");
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.search) query.set("search", params.search);
  const qStr = query.toString();
  return api.get<Paginated<Project>>(`/projects${qStr ? `?${qStr}` : ""}`);
};

export const createProject = (data: unknown) =>
  api.post<ApiResponse<Project>>("/projects", data);

export const updateProject = (id: string, data: unknown) =>
  api.put<ApiResponse<Project>>(`/projects/${id}`, data);

export const deleteProject = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/projects/${id}`);

/** Upload cover image for a project (multipart/form-data) */
export function uploadProjectCoverImage(projectId: string, formData: FormData) {
  const token = typeof window !== "undefined" ? authStorage.get() : null;
  return api.post<ApiResponse<{ url: string; publicId: string }>>(`/projects/${projectId}/cover-image`, formData, {
    token: token || undefined,
  });
}

/** Upload additional image to a project's gallery */
export function addProjectImage(projectId: string, formData: FormData) {
  const token = typeof window !== "undefined" ? authStorage.get() : null;
  return api.post<ApiResponse<{ url: string }>>(`/projects/${projectId}/images`, formData, {
    token: token || undefined,
  });
}

// ─── Services ───────────────────────────────────────────────────────────────
export const getServices = (params?: { limit?: number; page?: number; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.search) query.set("search", params.search);
  const qStr = query.toString();
  return api.get<Paginated<Service>>(`/services${qStr ? `?${qStr}` : ""}`);
};

/** Upload cover image for a service (multipart/form-data) */
export function uploadServiceCoverImage(serviceId: string, formData: FormData) {
  const token = typeof window !== "undefined" ? authStorage.get() : null;
  return api.post<ApiResponse<{ url: string }>>(`/services/${serviceId}/cover-image`, formData, {
    token: token || undefined,
  });
}

// ─── Testimonials ───────────────────────────────────────────────────────────
export const getTestimonials = (params?: { limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", params.limit.toString());
  const qStr = query.toString();
  return api.get<Paginated<Testimonial>>(`/testimonials${qStr ? `?${qStr}` : ""}`);
};

// ─── FAQs ───────────────────────────────────────────────────────────────────
export const getFaqs = () =>
  api.get<{ success: boolean; data: FaqItem[] }>("/faqs");

// ─── Inquiries ───────────────────────────────────────────────────────────────
export const createInquiry = (data: unknown) =>
  api.post<ApiResponse<Inquiry>>("/inquiries", data);

// ─── Settings ───────────────────────────────────────────────────────────────
export const getSettings = () =>
  api.get<{ success: boolean; data: Record<string, string> }>("/settings");
