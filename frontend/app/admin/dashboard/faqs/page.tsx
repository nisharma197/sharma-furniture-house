"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { FaqItem } from "@/lib/types";

const emptyForm = { question: "", answer: "" };

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    const token = authStorage.get();
    const res = await api.get<{ success: boolean; data: FaqItem[] }>("/faqs", { token: token || undefined });
    setFaqs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const edit = (f: FaqItem) => {
    setEditingId(f.id);
    setForm({ question: f.question, answer: f.answer });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = authStorage.get() || undefined;
    try {
      if (editingId) {
        await api.put(`/faqs/${editingId}`, form, { token });
      } else {
        await api.post("/faqs", form, { token });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save FAQ");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const token = authStorage.get() || undefined;
    await api.delete(`/faqs/${id}`, { token });
    load();
  };

  return (
    <div>
      <p className="font-display text-2xl font-semibold text-walnut-900">FAQs</p>
      <p className="mt-1 text-sm text-walnut-500">Manage frequently asked questions shown on your website.</p>

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-sm border border-walnut-100 bg-white/50 p-6">
        <input required placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        <textarea required placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} className="rounded-sm border border-walnut-100 px-3.5 py-2 text-sm focus-ring" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="rounded-sm bg-walnut-900 px-5 py-2.5 text-sm font-medium text-linen focus-ring">
            {editingId ? "Update FAQ" : "Add FAQ"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-sm border border-walnut-200 px-5 py-2.5 text-sm font-medium text-walnut-700 focus-ring">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="rounded-sm border border-walnut-100 bg-white/50 p-4">
            <p className="font-medium text-walnut-900">{f.question}</p>
            <p className="mt-1 text-sm text-walnut-700">{f.answer}</p>
            <div className="mt-3 flex gap-3 text-xs font-medium">
              <button onClick={() => edit(f)} className="text-brass-600 hover:underline focus-ring">Edit</button>
              <button onClick={() => remove(f.id)} className="text-red-600 hover:underline focus-ring">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
