import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/lib/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block overflow-hidden rounded-sm border border-walnut-100 bg-white/40 hover:border-brass-400 transition-colors focus-ring"
    >
      <div className="relative aspect-[4/3] bg-walnut-50">
        {service.coverImage ? (
          <Image
            src={service.coverImage}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut-300 text-sm">Image coming soon</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-walnut-900">{service.title}</h3>
        <p className="mt-2 text-sm text-walnut-700 line-clamp-2">{service.description}</p>
        <span className="mt-3 inline-block text-sm font-medium text-brass-600 group-hover:underline">
          Learn more &rarr;
        </span>
      </div>
    </Link>
  );
}
