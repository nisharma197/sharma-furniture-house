import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";
import { api } from "@/lib/api";
import type { Paginated, Testimonial } from "@/lib/types";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients say about custom furniture and carpentry work by Sharma Furniture House.",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const res = await api
    .get<Paginated<Testimonial>>("/testimonials?limit=100", { cache: "no-store" })
    .catch(() => null);
  const testimonials = res?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading eyebrow="Client Feedback" title="Testimonials" align="center" />
      {testimonials.length === 0 ? (
        <p className="mt-10 text-center text-walnut-500 text-sm">
          Testimonials will appear here once added from the admin dashboard.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      )}
    </div>
  );
}
