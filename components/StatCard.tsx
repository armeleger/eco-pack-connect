// components/StatCard.tsx
// ============================================================
// Reusable stat card for dashboards (Seller + Admin).
// ============================================================
type StatCardProps = {
  label:   string;
  value:   string;
  sub:     string;
  icon:    React.ReactNode;
  accent:  string; // Tailwind bg class e.g. "bg-emerald-50"
  iconColor: string; // Tailwind text class
};

export default function StatCard({ label, value, sub, icon, accent, iconColor }: StatCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-stone-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900" style={{fontFamily:"var(--font-display)"}}>{value}</p>
      <p className="text-xs text-stone-400 mt-1">{sub}</p>
    </div>
  );
}