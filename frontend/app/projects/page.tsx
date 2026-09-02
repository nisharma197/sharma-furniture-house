import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { api } from "@/lib/api";
import type { Paginated, Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "Completed carpentry and furniture projects for homes, hotels, hostels, schools, and offices.",
};

export const dynamic = "force-dynamic";

const categories = [
  { value: "", label: "All" },
  { value: "HOME", label: "Homes" },
  { value: "HOTEL", label: "Hotels" },
  { value: "HOSTEL", label: "Hostels" },
  { value: "SCHOOL", label: "Schools" },
  { value: "COLLEGE", label: "Colleges" },
  { value: "OFFICE", label: "Offices" },
  { value: "RESTAURANT", label: "Restaurants" },
  { value: "COMMERCIAL", label: "Commercial" },
];

export default async function ProjectsPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category || "";
  const res = await api
    .get<Paginated<Project>>(`/projects?limit=100${category ? `&category=${category}` : ""}`, {
      cache: "no-store",
    })
    .catch(() => null);
  const projects = res?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Our Work"
        title="Completed Projects"
        description="A look at recent residential and commercial carpentry projects."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <a
            key={c.value}
            href={c.value ? `/projects?category=${c.value}` : "/projects"}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-ring ${
              category === c.value
                ? "bg-walnut-900 border-walnut-900 text-linen"
                : "border-walnut-200 text-walnut-700 hover:bg-walnut-50"
            }`}
          >
            {c.label}
          </a>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-walnut-500 text-sm">
          No projects to show yet for this category. Check back soon, or view all projects.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
