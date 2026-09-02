"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { Inquiry, Paginated } from "@/lib/types";

const statuses = ["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"] as const;

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = authStorage.get();
    if (!token) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "100", ...(search ? { search } : {}), ...(statusFilter ? { status: statusFilter } : {}) });
      const res = await api.get<Paginated<Inquiry>>(`/inquiries?${qs.toString()}`, { token });
      setInquiries(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const token = authStorage.get();
    await api.patch(`/inquiries/${id}/status`, { status }, { token: token || undefined });
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: status as Inquiry["status"] } : i)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const token = authStorage.get();
    await api.delete(`/inquiries/${id}`, { token: token || undefined });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const exportCsv = () => {
    const token = authStorage.get();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/inquiries/export`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inquiries.csv";
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-semibold text-walnut-900">Inquiries</p>
          <p className="mt-1 text-sm text-walnut-500">View, search, and manage customer inquiries.</p>
        </div>
        <button onClick={exportCsv} className="rounded-sm border border-walnut-200 px-4 py-2 text-sm font-medium text-walnut-800 hover:bg-walnut-50 focus-ring">
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          placeholder="Search by name, phone, email, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="min-w-[260px] flex-1 rounded-sm border border-walnut-100 bg-white px-3.5 py-2 text-sm focus-ring"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-sm border border-walnut-100 bg-white px-3.5 py-2 text-sm focus-ring">
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={load} className="rounded-sm bg-walnut-900 px-4 py-2 text-sm font-medium text-linen focus-ring">Search</button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-walnut-100 bg-white/50">
        <table className="min-w-full text-sm">
          <thead className="bg-walnut-50 text-left text-xs uppercase tracking-wide text-walnut-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-walnut-50">
            {loading ? (
              <tr><td className="px-4 py-6 text-walnut-500" colSpan={7}>Loading...</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td className="px-4 py-6 text-walnut-500" colSpan={7}>No inquiries found.</td></tr>
            ) : (
              inquiries.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-3 font-medium text-walnut-900">{i.name}</td>
                  <td className="px-4 py-3 text-walnut-700">{i.phone}<br />{i.email}</td>
                  <td className="px-4 py-3 text-walnut-700">{i.projectType}<br />{i.furnitureRequired}</td>
                  <td className="px-4 py-3 text-walnut-700 max-w-xs truncate" title={i.message}>{i.message}</td>
                  <td className="px-4 py-3">
                    <select
                      value={i.status}
                      onChange={(e) => updateStatus(i.id, e.target.value)}
                      className="rounded-sm border border-walnut-100 bg-white px-2 py-1 text-xs focus-ring"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-walnut-500 whitespace-nowrap">
                    {new Date(i.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(i.id)} className="text-xs font-medium text-red-600 hover:underline focus-ring">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
