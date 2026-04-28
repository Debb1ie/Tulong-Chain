// src/components/TransactionHistory.tsx
import { useEffect, useState, useCallback } from "react";
import { CONFIG } from "../lib/config";

interface HorizonPayment {
  id: string;
  type: string;
  timestamp: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  amount: string;
  from: string;
  to: string;
  transaction_hash: string;
}

export default function TransactionHistory() {
  const [payments, setPayments] = useState<HorizonPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      // Use Horizon's payments endpoint for the contract account
      const url = `https://horizon-testnet.stellar.org/accounts/${CONFIG.contractId}/payments?order=desc&limit=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Horizon error: ${res.status}`);
      const data = await res.json();

      // Filter only incoming payments to the contract
      const incoming: HorizonPayment[] = (data._embedded?.records || [])
        .filter((p: any) => p.type === "payment" && p.to === CONFIG.contractId)
        .map((p: any) => ({
          id: p.id,
          type: p.type,
          timestamp: p.created_at,
          asset_type: p.asset_type,
          asset_code: p.asset_code,
          asset_issuer: p.asset_issuer,
          amount: p.amount,
          from: p.from,
          to: p.to,
          transaction_hash: p.transaction_hash,
        }));

      setPayments(incoming);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch payments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 8000); // poll every 8s
    return () => clearInterval(interval);
  }, [fetchPayments]);

  function formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString();
  }

  function formatAsset(p: HorizonPayment): string {
    if (p.asset_type === "native") return "XLM";
    return p.asset_code || "TKM";
  }

  function truncate(addr: string): string {
    if (!addr) return "—";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <div className="transaction-history">
      <div className="history-header">
        <span className="history-title">Live Incoming Payments</span>
        <span className="history-badge">{payments.length} detected</span>
      </div>

      {loading && <p className="history-loading">Loading transactions...</p>}
      {error && <p className="history-error">Error: {error}</p>}

      {!loading && payments.length === 0 && (
        <p className="history-empty">
          No incoming payments detected yet. Send XLM or USDC to the contract address above.
        </p>
      )}

      <div className="history-list">
        {payments.map((p) => (
          <div key={p.id} className="history-row">
            <div className="history-amount">
              <span className="amt-val">{parseFloat(p.amount).toFixed(4)}</span>
              <span className="amt-asset">{formatAsset(p)}</span>
            </div>
            <div className="history-meta">
              <span className="meta-from">From: {truncate(p.from)}</span>
              <span className="meta-time">{formatTime(p.timestamp)}</span>
            </div>
            <a
              className="history-explorer"
              href={`https://stellar.expert/explorer/testnet/tx/${p.transaction_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
