// src/components/ActivityFeed.tsx

interface ActivityItem {
  _id: string;
  type: "donation" | "withdrawal" | "emergency_declared" | "emergency_lifted";
  address: string;
  amount?: number;
  description: string;
  timestamp: number;
}

interface Props {
  items: ActivityItem[];
}

const TYPE_ICON: Record<string, string> = {
  donation: "$",
  withdrawal: "out",
  emergency_declared: "!",
  emergency_lifted: "ok",
};

const TYPE_CLASS: Record<string, string> = {
  donation: "donation",
  withdrawal: "withdrawal",
  emergency_declared: "emergency",
  emergency_lifted: "emergency",
};

export default function ActivityFeed({ items }: Props) {
  return (
    <div className="activity-list">
      {items.length === 0 && (
        <p className="empty-feed">No activity yet. Be the first to donate!</p>
      )}
      {items.map((item) => (
        <div key={item._id} className="activity-item">
          <div className={`act-icon ${TYPE_CLASS[item.type]}`}>
            {TYPE_ICON[item.type]}
          </div>
          <div className="activity-body">
            <p className="act-desc">{item.description}</p>
            <p className="act-meta">
              {item.address.slice(0, 6)}...{item.address.slice(-4)} -{" "}
              {new Date(item.timestamp).toLocaleString("en-PH")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}