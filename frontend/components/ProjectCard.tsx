import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

const categoryLabel = (c: string) =>
  c
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-sm border border-walnut-100 bg-white/40 hover:border-brass-400 transition-colors focus-ring"
    >
      <div className="relative aspect-[4/3] bg-walnut-50">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut-300 text-sm">Image coming soon</div>
        )}
        <span className="absolute top-3 left-3 rounded-sm bg-walnut-900/85 px-2.5 py-1 text-xs font-medium text-brass-400">
          {categoryLabel(project.category)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-walnut-900">{project.title}</h3>
        {project.location && <p className="mt-1 text-xs text-walnut-500">{project.location}</p>}
        <p className="mt-2 text-sm text-walnut-700 line-clamp-2">{project.description}</p>
      </div>
    </Link>
  );
}
