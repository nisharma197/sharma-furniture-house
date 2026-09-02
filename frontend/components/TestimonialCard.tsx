import type { Testimonial } from "@/lib/types";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="rounded-sm border border-walnut-100 bg-white/50 p-6 h-full flex flex-col">
      <div className="flex gap-1 text-brass-500" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill={i < testimonial.rating ? "currentColor" : "none"} stroke="currentColor">
            <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85L10 1.5z" />
          </svg>
        ))}
      </div>
      <blockquote className="mt-4 text-walnut-800 leading-relaxed flex-1">&ldquo;{testimonial.message}&rdquo;</blockquote>
      <figcaption className="mt-5 border-t border-walnut-100 pt-4">
        <p className="font-display font-semibold text-walnut-900">{testimonial.clientName}</p>
        <p className="text-xs text-walnut-500">
          {[testimonial.projectType, testimonial.location].filter(Boolean).join(" · ")}
        </p>
      </figcaption>
    </figure>
  );
}
