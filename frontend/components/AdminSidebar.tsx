"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth";

const links = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/inquiries", label: "Inquiries" },
  { href: "/admin/dashboard/services", label: "Services" },
  { href: "/admin/dashboard/projects", label: "Projects" },
  { href: "/admin/dashboard/gallery", label: "Gallery" },
  { href: "/admin/dashboard/testimonials", label: "Testimonials" },
  { href: "/admin/dashboard/faqs", label: "FAQs" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    authStorage.clear();
    router.push("/admin/login");
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-walnut-100 bg-white/40 lg:min-h-screen">
      <div className="p-6">
        <p className="font-display text-lg font-semibold text-walnut-900">Admin Panel</p>
        <p className="text-xs text-walnut-500">Sharma Furniture House</p>
      </div>
      <nav className="px-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-sm px-3 py-2.5 text-sm font-medium transition-colors focus-ring ${
              pathname === link.href
                ? "bg-walnut-900 text-linen"
                : "text-walnut-700 hover:bg-walnut-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 mt-4">
        <button
          onClick={logout}
          className="w-full rounded-sm border border-walnut-200 px-3 py-2.5 text-sm font-medium text-walnut-700 hover:bg-walnut-50 focus-ring"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
