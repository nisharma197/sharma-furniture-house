import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { api } from "@/lib/api";
import type { FaqItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about custom furniture and carpentry services from Sharma Furniture House.",
};

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const res = await api.get<{ success: boolean; data: FaqItem[] }>("/faqs", { cache: "no-store" }).catch(() => null);
  const faqs = res?.data || [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <SectionHeading eyebrow="Common Questions" title="Frequently Asked Questions" align="center" />
      {faqs.length === 0 ? (
        <p className="mt-10 text-center text-walnut-500 text-sm">FAQs will appear here once added from the admin dashboard.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <details key={f.id} className="group rounded-sm border border-walnut-100 bg-white/50 p-5">
              <summary className="cursor-pointer list-none font-medium text-walnut-900 focus-ring">
                {f.question}
              </summary>
              <p className="mt-3 text-sm text-walnut-700 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
