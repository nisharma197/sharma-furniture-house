export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-600 mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-walnut-900 leading-tight">{title}</h2>
      {description && <p className="mt-4 text-walnut-700 leading-relaxed">{description}</p>}
    </div>
  );
}
