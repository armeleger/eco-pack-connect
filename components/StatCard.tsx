// components/StatCard.tsx
// ============================================================
// Reusable KPI stat card for Seller Dashboard and Admin panel.
// Supports trend indicators and click actions.
// ============================================================
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type StatCardProps = {
  label:      string;
  value:      string;
  sub:        string;
  icon:       React.ReactNode;
  accent:     string;
  iconColor:  string;
  trend?:     "up" | "down" | "flat";
  trendValue?: string;
  onClick?:   () => void;
};

export default function StatCard({
  label, value, sub, icon, accent, iconColor,
  trend, trendValue, onClick
}: StatCardProps) {
  const trendConfig = {
    up:   { icon: <TrendingUp size={11} />,   cls: "text-emerald-600 bg-emerald-50" },
    down: { icon: <TrendingDown size={11} />, cls: "text-red-500 bg-red-50" },
    flat: { icon: <Minus size={11} />,        cls: "text-stone-400 bg-stone-100" },
  };

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`bg-white border border-stone-200 rounded-2xl p-5 transition-all ${
        onClick
          ? "hover:shadow-md hover:border-[#2D6A4F]/30 cursor-pointer active:scale-[0.98]"
          : "hover:shadow-sm"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider truncate">
            {label}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 ${accent}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>

      {/* Value */}
      <p
        className="text-2xl font-bold text-stone-900 mb-1 leading-none"
        style={{fontFamily:"var(--font-display)"}}
      >
        {value}
      </p>

      {/* Sub + Trend */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-stone-400">{sub}</p>
        {trend && trendValue && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendConfig[trend].cls}`}>
            {trendConfig[trend].icon}
            {trendValue}
          </span>
        )}
      </div>

      {/* Bottom bar accent */}
      <div className={`mt-3 h-0.5 rounded-full ${accent} opacity-40`} />
    </Wrapper>
  );
}