"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { authStorage } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = authStorage.get();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="flex min-h-[60vh] items-center justify-center text-walnut-500 text-sm">Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
