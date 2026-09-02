import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { ApiResponse, Project } from "@/lib/types";

async function getProject(slug: string) {
  try {
    const res = await api.get<ApiResponse<Project>>(`/projects/${slug}`, { cache: "no-store" });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <Link href="/projects" className="text-sm text-brass-600 hover:underline">
        &larr; All Projects
      </Link>

      <div className="mt-6 relative aspect-[16/9] rounded-sm overflow-hidden bg-walnut-50">
        {project.coverImage ? (
          <Image src={project.coverImage} alt={project.title} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut-300 text-sm">Image coming soon</div>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl font-semibold text-walnut-900">{project.title}</h1>
          <p className="mt-4 text-walnut-700 leading-relaxed">{project.description}</p>
        </div>

        <aside className="rounded-sm border border-walnut-100 bg-walnut-50 p-6 h-fit space-y-4 text-sm">
          <div>
            <p className="text-walnut-500">Category</p>
            <p className="font-medium text-walnut-900">{project.category}</p>
          </div>
          {project.location && (
            <div>
              <p className="text-walnut-500">Location</p>
              <p className="font-medium text-walnut-900">{project.location}</p>
            </div>
          )}
          {project.completionDate && (
            <div>
              <p className="text-walnut-500">Completed</p>
              <p className="font-medium text-walnut-900">
                {new Date(project.completionDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            </div>
          )}
        </aside>
      </div>

      {project.images?.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold text-walnut-900">Project Gallery</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-sm overflow-hidden bg-walnut-50">
                <Image src={img.url} alt={img.caption || project.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
