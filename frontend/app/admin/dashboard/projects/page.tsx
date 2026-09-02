"use client";

import { useEffect, useState } from "react";
import { authStorage } from "@/lib/auth";
import type { Paginated, Project } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

const categories = [
  "HOME", "VILLA", "APARTMENT", "HOSTEL", "HOTEL", "RESTAURANT", "CAFE", "SCHOOL",
  "COLLEGE", "COACHING_INSTITUTE", "HOSPITAL", "CLINIC", "OFFICE", "CORPORATE",
  "SHOP", "SHOWROOM", "COMMERCIAL", "OTHER",
];

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  category: "HOME",
  location: "",
  coverImage: "",
  images: [] as string[],
  isFeatured: false,
  isActive: true,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const load = async () => {
    setError("");
    try {
      const token = authStorage.get();
      const res = await fetch(`${API_URL}/projects?limit=100`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      setProjects((json as Paginated<Project>).data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setForm((f) => ({
      ...f,
      title: val,
      slug: !editingId ? autoSlug : f.slug,
    }));
  };

  const edit = (p: Project) => {
    setEditingId(p.id);
    setError("");
    setSuccessMsg("");
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      location: p.location || "",
      coverImage: p.coverImage || "",
      images: (p.images || []).map((img) => img.url),
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);

    const payload = {
      ...form,
      location: form.location || undefined,
      coverImage: form.coverImage || undefined,
      images: form.images.map((url, i) => ({ url, sortOrder: i })),
    };

    try {
      const token = authStorage.get();
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/projects/${editingId}` : `${API_URL}/projects`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save project");

      setSuccessMsg(editingId ? "Project updated successfully" : "Project created successfully");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setError("");
    setDeletingId(id);
    try {
      const token = authStorage.get();
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete");
      setSuccessMsg("Project deleted");
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const categoryLabel = (cat: string) => cat.replace(/_/g, " ");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-semibold text-walnut-900">Projects</p>
          <p className="mt-1 text-sm text-walnut-500">Manage completed projects shown on your website.</p>
        </div>
        <span className="rounded-full bg-walnut-100 px-3 py-1 text-xs font-medium text-walnut-700">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {successMsg && (
        <div className="mt-4 flex items-center justify-between rounded-sm border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <p>{successMsg}</p>
          <button onClick={() => setSuccessMsg("")} className="ml-2 font-bold text-green-600 hover:text-green-900">&times;</button>
        </div>
      )}
      {error && (
        <div className="mt-4 flex items-center justify-between rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button onClick={() => setError("")} className="ml-2 font-bold text-red-600 hover:text-red-900">&times;</button>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 rounded-sm border border-walnut-100 bg-white/60 p-6 shadow-sm">
        <p className="font-display text-lg font-semibold text-walnut-900 mb-4">
          {editingId ? "Edit Project" : "Add New Project"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Title *</label>
            <input
              required
              placeholder="e.g. Complete Home Furniture – Vijay Nagar"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Slug *</label>
            <input
              required
              placeholder="e.g. complete-home-furniture-vijay-nagar"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-walnut-700 mb-1">Description *</label>
            <textarea
              required
              minLength={10}
              placeholder="Describe the project, materials used, scope of work..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{categoryLabel(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-walnut-700 mb-1">Location</label>
            <input
              placeholder="e.g. Vijay Nagar, Indore"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <p className="text-sm font-medium text-walnut-800">Cover Image</p>
            <div className="flex items-center gap-3">
              <ImageUploader label="Upload cover image" onUploaded={(url) => setForm((f) => ({ ...f, coverImage: url }))} />
              {form.coverImage && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover preview" className="h-16 w-16 rounded-sm object-cover border border-walnut-100" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs focus-ring"
                    aria-label="Remove cover image"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <p className="text-sm font-medium text-walnut-800">Project Gallery Images</p>
            <ImageUploader label="Add gallery image" onUploaded={(url) => setForm((f) => ({ ...f, images: [...f.images, url] }))} />
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Project photo ${idx + 1}`} className="h-16 w-16 rounded-sm object-cover border border-walnut-100" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs focus-ring"
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-walnut-700">
              <input type="checkbox" className="accent-brass-500" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-walnut-700">
              <input type="checkbox" className="accent-brass-500" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Visible on website
            </label>
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2 border-t border-walnut-50">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm bg-walnut-900 px-6 py-2.5 text-sm font-medium text-linen hover:bg-brass-600 transition-colors disabled:opacity-60 focus-ring"
            >
              {saving ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Project" : "Add Project")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-sm border border-walnut-200 px-6 py-2.5 text-sm font-medium text-walnut-700 hover:bg-walnut-50 transition-colors focus-ring"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Project List */}
      <div className="mt-10">
        <p className="font-display text-xl font-semibold text-walnut-900">All Projects ({projects.length})</p>

        {loading ? (
          <div className="mt-4 rounded-sm border border-walnut-100 bg-white/50 p-8 text-center">
            <p className="text-sm text-walnut-500">Loading projects from database...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-4 rounded-sm border border-dashed border-walnut-200 bg-white/30 p-8 text-center">
            <p className="font-medium text-walnut-800">No projects yet</p>
            <p className="mt-1 text-sm text-walnut-500">Use the form above to add your first completed project.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-sm border border-walnut-100 bg-white/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt={p.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full bg-walnut-50 flex items-center justify-center">
                    <svg className="h-10 w-10 text-walnut-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <p className="font-medium text-walnut-900 truncate">{p.title}</p>
                  <p className="text-xs text-walnut-500">{categoryLabel(p.category)} · {p.slug}</p>
                  {p.location && <p className="mt-1 text-xs text-walnut-600">{p.location}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                      {p.isActive ? "Visible" : "Hidden"}
                    </span>
                    {p.isFeatured && (
                      <span className="rounded-full bg-brass-50 px-2 py-0.5 text-[10px] font-medium text-brass-700">Featured</span>
                    )}
                    {p.images?.length > 0 && (
                      <span className="rounded-full bg-walnut-50 px-2 py-0.5 text-[10px] font-medium text-walnut-600">
                        {p.images.length} photo{p.images.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-3 border-t border-walnut-50 pt-3 text-xs font-medium">
                    <button onClick={() => edit(p)} className="text-brass-600 hover:underline focus-ring">Edit</button>
                    <button
                      onClick={() => remove(p.id)}
                      disabled={deletingId === p.id}
                      className="text-red-600 hover:underline disabled:opacity-50 focus-ring"
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
