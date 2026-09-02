"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { authStorage } from "@/lib/auth";
import type { GalleryImage, Paginated } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UploadForm {
  file: File | null;
  title: string;
  category: string;
  altText: string;
  isFeatured: boolean;
}

const emptyForm: UploadForm = {
  file: null,
  title: "",
  category: "",
  altText: "",
  isFeatured: false,
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [form, setForm] = useState<UploadForm>(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ caption: "", category: "", altText: "", isFeatured: false, isActive: true });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const token = authStorage.get();
    const res = await fetch(`${API_URL}/gallery?limit=100`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json();
    setImages((json as Paginated<GalleryImage>).data || []);
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (file: File) => {
    setForm((f) => ({ ...f, file }));
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file) { setError("Please select an image file."); return; }
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const token = authStorage.get();
      const formData = new FormData();
      formData.append("image", form.file);
      if (form.title) formData.append("title", form.title);
      if (form.category) formData.append("category", form.category);
      if (form.altText) formData.append("altText", form.altText);
      formData.append("isFeatured", form.isFeatured ? "true" : "false");

      // POST multipart/form-data — backend handles Cloudinary upload + DB record atomically
      const res = await fetch(`${API_URL}/gallery/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        // Do NOT set Content-Type — browser sets multipart boundary automatically
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Upload failed");
      }

      setSuccess(`✓ Image uploaded and saved to database (ID: ${json.data.id})`);
      setForm(emptyForm);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this image from the gallery? This cannot be undone.")) return;
    const token = authStorage.get();
    const res = await fetch(`${API_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) await load();
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditForm({
      caption: img.caption || "",
      category: img.category || "",
      altText: img.altText || "",
      isFeatured: img.isFeatured,
      isActive: img.isActive,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const token = authStorage.get();
    const res = await fetch(`${API_URL}/gallery/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditingId(null);
      await load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-walnut-900">Gallery</p>
          <p className="mt-1 text-sm text-walnut-500">
            Upload images to Cloudinary and save them to the database in one step.
          </p>
        </div>
        <span className="rounded-full bg-walnut-100 px-3 py-1 text-xs font-medium text-walnut-700">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Upload Form */}
      <form
        onSubmit={submit}
        className="mt-6 rounded-sm border border-walnut-100 bg-white/60 p-6 shadow-sm"
      >
        <p className="font-display text-lg font-semibold text-walnut-900 mb-4">Upload New Image</p>

        {/* Dropzone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) handleFileChange(file);
          }}
          className="relative cursor-pointer rounded-sm border-2 border-dashed border-walnut-200 bg-walnut-50/50 hover:border-brass-500 transition-colors p-8 text-center mb-4"
        >
          {preview ? (
            <div className="flex items-center justify-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="h-24 w-24 rounded-sm object-cover border border-walnut-100" />
              <div className="text-left">
                <p className="font-medium text-walnut-900">{form.file?.name}</p>
                <p className="text-xs text-walnut-500">{form.file ? `${(form.file.size / 1024).toFixed(1)} KB` : ""}</p>
                <p className="mt-1 text-xs text-brass-600">Click to change</p>
              </div>
            </div>
          ) : (
            <>
              <svg className="mx-auto mb-3 h-10 w-10 text-walnut-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-walnut-700">Drag & drop an image here, or click to select</p>
              <p className="text-xs text-walnut-400 mt-1">JPG, PNG, WebP up to 8MB</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Title / Caption</label>
            <input
              placeholder="e.g. Custom Wardrobe — Vijay Nagar"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Category</label>
            <input
              placeholder="e.g. Wardrobes, Beds, Kitchen..."
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Alt Text (for accessibility)</label>
            <input
              placeholder="Describe the image content"
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm text-walnut-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-4 w-4 accent-brass-500"
              />
              <span>Feature on homepage</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-3 flex items-start gap-2 rounded-sm border border-green-200 bg-green-50 p-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !form.file}
          className="mt-4 rounded-sm bg-walnut-900 px-6 py-2.5 text-sm font-medium text-linen hover:bg-brass-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading to Cloudinary & saving to database...
            </span>
          ) : (
            "Upload & Save to Database"
          )}
        </button>
      </form>

      {/* Gallery Grid */}
      <div className="mt-8">
        <p className="font-display text-xl font-semibold text-walnut-900 mb-4">
          All Gallery Images ({images.length})
        </p>

        {images.length === 0 ? (
          <div className="rounded-sm border border-dashed border-walnut-200 bg-white/30 p-12 text-center">
            <svg className="mx-auto mb-3 h-12 w-12 text-walnut-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-walnut-700">No gallery images yet</p>
            <p className="mt-1 text-sm text-walnut-400">Use the form above to upload your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-sm border border-walnut-100 bg-white/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={img.url}
                    alt={img.altText || img.caption || "Gallery image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {img.isFeatured && (
                    <span className="absolute top-2 left-2 rounded-full bg-brass-500 px-2 py-0.5 text-[10px] font-medium text-white">
                      Featured
                    </span>
                  )}
                  {!img.isActive && (
                    <span className="absolute top-2 right-2 rounded-full bg-gray-800/80 px-2 py-0.5 text-[10px] font-medium text-white">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  {img.caption && <p className="truncate text-xs font-medium text-walnut-800">{img.caption}</p>}
                  {img.category && <p className="text-[10px] text-walnut-400">{img.category}</p>}
                  <p className="mt-1 text-[9px] font-mono text-walnut-300 truncate">{img.id}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(img)}
                      className="text-xs font-medium text-brass-600 hover:underline focus-ring"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(img.id)}
                      className="text-xs font-medium text-red-600 hover:underline focus-ring"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-walnut-900/70 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingId(null); }}
        >
          <div className="w-full max-w-md rounded-sm border border-walnut-100 bg-linen p-6 shadow-xl">
            <p className="font-display text-lg font-semibold text-walnut-900 mb-4">Edit Image Metadata</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-walnut-700 mb-1">Caption</label>
                <input
                  value={editForm.caption}
                  onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                  className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-walnut-700 mb-1">Category</label>
                <input
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-walnut-700 mb-1">Alt Text</label>
                <input
                  value={editForm.altText}
                  onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                  className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-walnut-700">
                  <input
                    type="checkbox"
                    checked={editForm.isFeatured}
                    onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                    className="accent-brass-500"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-walnut-700">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="accent-brass-500"
                  />
                  Visible
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={saveEdit}
                className="rounded-sm bg-walnut-900 px-5 py-2 text-sm font-medium text-linen hover:bg-brass-600 transition-colors focus-ring"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="rounded-sm border border-walnut-200 px-5 py-2 text-sm font-medium text-walnut-700 focus-ring"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
