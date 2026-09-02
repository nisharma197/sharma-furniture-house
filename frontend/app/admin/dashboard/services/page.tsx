"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { Paginated, Service } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  materials: "",
  finish: "",
  featuresText: "",
  coverImage: "",
  images: [] as string[],
  isActive: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    const token = authStorage.get();
    const res = await api.get<Paginated<Service>>("/services?limit=100", { token: token || undefined });
    setServices(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const edit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      slug: s.slug,
      description: s.description,
      materials: s.materials || "",
      finish: s.finish || "",
      featuresText: (s.features || []).join(", "),
      coverImage: s.coverImage || "",
      images: s.images || [],
      isActive: s.isActive,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = authStorage.get() || undefined;
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      materials: form.materials || undefined,
      finish: form.finish || undefined,
      features: form.featuresText.split(",").map((f) => f.trim()).filter(Boolean),
      coverImage: form.coverImage || undefined,
      images: form.images,
      isActive: form.isActive,
    };
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, payload, { token });
      } else {
        await api.post("/services", payload, { token });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const token = authStorage.get() || undefined;
    await api.delete(`/services/${id}`, { token });
    load();
  };

  return (
    <div>
      <p className="font-display text-2xl font-semibold text-walnut-900">Services</p>
      <p className="mt-1 text-sm text-walnut-500">Manage the services shown on your website.</p>

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-sm border border-walnut-100 bg-white/50 p-6 sm:grid-cols-2">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <input required placeholder="Slug (e.g. custom-sofa-sets)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" rows={3} />
        <input placeholder="Materials" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <input placeholder="Finish options" value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <input placeholder="Features (comma separated)" value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} className="sm:col-span-2 rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />

        <div className="sm:col-span-2 space-y-2">
          <p className="text-sm font-medium text-walnut-800">Cover Image</p>
          <div className="flex items-center gap-3">
            <ImageUploader label="Upload cover image" onUploaded={(url) => setForm((f) => ({ ...f, coverImage: url }))} />
            {form.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="Cover preview" className="h-14 w-14 rounded-sm object-cover border border-walnut-100" />
            )}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <p className="text-sm font-medium text-walnut-800">Gallery Images</p>
          <ImageUploader label="Add gallery image" onUploaded={(url) => setForm((f) => ({ ...f, images: [...f.images, url] }))} />
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Gallery ${idx + 1}`} className="h-16 w-16 rounded-sm object-cover border border-walnut-100" />
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

        <label className="flex items-center gap-2 text-sm text-walnut-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Visible on website
        </label>
        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" className="rounded-sm bg-walnut-900 px-5 py-2.5 text-sm font-medium text-linen focus-ring">
            {editingId ? "Update Service" : "Add Service"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-sm border border-walnut-200 px-5 py-2.5 text-sm font-medium text-walnut-700 focus-ring">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-sm border border-walnut-100 bg-white/50 p-4">
            <p className="font-medium text-walnut-900">{s.title}</p>
            <p className="text-xs text-walnut-500">{s.slug}</p>
            <p className="mt-1 text-xs">{s.isActive ? <span className="text-green-700">Active</span> : <span className="text-walnut-400">Hidden</span>}</p>
            <div className="mt-3 flex gap-3 text-xs font-medium">
              <button onClick={() => edit(s)} className="text-brass-600 hover:underline focus-ring">Edit</button>
              <button onClick={() => remove(s.id)} className="text-red-600 hover:underline focus-ring">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
