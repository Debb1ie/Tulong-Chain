// src/components/StatsCard.tsx
interface Props {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}

export default function StatsCard({ label, value, icon, highlight }: Props) {
  return (
    <div className={`stat-card${highlight ? " highlight" : ""}`}>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-val">{value}</p>
      </div>
      <span className={`stat-card-icon icon-${icon}`}></span>
    </div>
  );
}