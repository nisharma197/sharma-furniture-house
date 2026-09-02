"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [category, setCategory] = useState<string>("");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(images.map((i) => i.category).filter(Boolean))) as string[],
    [images]
  );
  const filtered = category ? images.filter((i) => i.category === category) : images;

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium focus-ring ${
              category === "" ? "bg-walnut-900 border-walnut-900 text-linen" : "border-walnut-200 text-walnut-700"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium focus-ring ${
                category === c ? "bg-walnut-900 border-walnut-900 text-linen" : "border-walnut-200 text-walnut-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 sm:columns-3 gap-4 space-y-4">
        {filtered.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img)}
            className="block w-full break-inside-avoid overflow-hidden rounded-sm border border-walnut-100 focus-ring"
          >
            <Image
              src={img.url}
              alt={img.caption || "Sharma Furniture House work"}
              width={500}
              height={500}
              loading="lazy"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-walnut-900/90 p-6"
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute top-6 right-6 text-linen focus-ring"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="relative max-h-[85vh] max-w-4xl w-full aspect-video">
            <Image src={lightbox.url} alt={lightbox.caption || ""} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
