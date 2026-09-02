"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import StatCard from "@/components/StatCard";

interface Stats {
  services: number;
  projects: number;
  galleryImages: number;
  testimonials: number;
  totalInquiries: number;
  newInquiries: number;
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = authStorage.get();
    if (!token) return;
    api
      .get<{ success: boolean; data: Stats }>("/admin/dashboard-stats", { token })
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <p className="font-display text-2xl font-semibold text-walnut-900">Dashboard Overview</p>
      <p className="mt-1 text-sm text-walnut-500">A quick snapshot of your website content.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="New Inquiries" value={stats?.newInquiries ?? "-"} />
        <StatCard label="Total Inquiries" value={stats?.totalInquiries ?? "-"} />
        <StatCard label="Services" value={stats?.services ?? "-"} />
        <StatCard label="Projects" value={stats?.projects ?? "-"} />
        <StatCard label="Gallery Images" value={stats?.galleryImages ?? "-"} />
        <StatCard label="Testimonials" value={stats?.testimonials ?? "-"} />
      </div>
    </div>
  );
}
