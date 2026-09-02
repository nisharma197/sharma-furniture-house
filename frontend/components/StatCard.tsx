export default function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-walnut-100 bg-white/50 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-walnut-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-walnut-900">{value}</p>
    </div>
  );
}
