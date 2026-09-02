"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { Paginated, Testimonial } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

const emptyForm = { clientName: "", location: "", projectType: "", message: "", rating: 5, avatarUrl: "" };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = async () => {
    const token = authStorage.get();
    const res = await api.get<Paginated<Testimonial>>("/testimonials?limit=100", { token: token || undefined });
    setTestimonials(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = authStorage.get() || undefined;
    try {
      await api.post("/testimonials", form, { token });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add testimonial");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const token = authStorage.get() || undefined;
    await api.delete(`/testimonials/${id}`, { token });
    load();
  };

  return (
    <div>
      <p className="font-display text-2xl font-semibold text-walnut-900">Testimonials</p>
      <p className="mt-1 text-sm text-walnut-500">Manage client testimonials shown on your website.</p>

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-sm border border-walnut-100 bg-white/50 p-6 sm:grid-cols-2">
        <input required placeholder="Client Name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <input placeholder="Project Type" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring">
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
          ))}
        </select>
        <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="sm:col-span-2 rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" rows={3} />
        <div className="sm:col-span-2 flex items-center gap-3">
          <ImageUploader label="Upload client photo (optional)" onUploaded={(url) => setForm((f) => ({ ...f, avatarUrl: url }))} />
          {form.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatarUrl} alt="Avatar preview" className="h-10 w-10 rounded-full object-cover border border-walnut-100" />
          )}
        </div>
        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="sm:col-span-2 rounded-sm bg-walnut-900 px-5 py-2.5 text-sm font-medium text-linen focus-ring">
          Add Testimonial
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-sm border border-walnut-100 bg-white/50 p-4">
            <p className="font-medium text-walnut-900">{t.clientName}</p>
            <p className="text-xs text-walnut-500">{t.projectType} &middot; {t.rating} stars</p>
            <p className="mt-2 text-sm text-walnut-700 line-clamp-3">{t.message}</p>
            <button onClick={() => remove(t.id)} className="mt-3 text-xs font-medium text-red-600 hover:underline focus-ring">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
