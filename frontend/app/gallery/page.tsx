import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import { api } from "@/lib/api";
import type { Paginated, GalleryImage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse photos of completed furniture and carpentry work by Sharma Furniture House.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const res = await api.get<Paginated<GalleryImage>>("/gallery?limit=100", { cache: "no-store" }).catch(() => null);
  const images = res?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading eyebrow="Our Craft" title="Gallery" description="A closer look at finished work and details." />
      {images.length === 0 ? (
        <p className="mt-10 text-walnut-500 text-sm">Gallery photos will appear here once added from the admin dashboard.</p>
      ) : (
        <div className="mt-10">
          <GalleryGrid images={images} />
        </div>
      )}
    </div>
  );
}
