// src/components/DonateForm.tsx
import { useState } from "react";
import { CONFIG } from "../lib/config";
import { downloadFeedbackCSV } from "../lib/feedback";

interface Props {
  wallet: {
    connected: boolean;
    address: string | null;
  };
  isAdmin?: boolean;
}

export default function DonateForm({ wallet, isAdmin = false }: Props) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(CONFIG.contractId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!wallet.connected) {
    return (
      <div className="donate-simple">
        <p className="donate-prompt">
          Connect your Freighter wallet to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="donate-simple">
      <h3 className="form-h3">Send XLM or USDC to the Fund</h3>
      <p className="form-desc">
        Copy the contract address below and send any amount directly from your Freighter wallet.
        Transactions are detected automatically.
      </p>

       <div className="address-box" onClick={copyAddress}>
         <span className="address-label">Donation Address (Tap to copy)</span>
         <span className="address-value">{CONFIG.contractId}</span>
         <span className="copy-status" style={{ opacity: copied ? 1 : 0.5 }}>
           {copied ? "Copied!" : "Copy"}
         </span>
       </div>

      <div className="donate-steps">
        <div className="step-item">
          <span className="step-num-mini">1</span>
          <span>Open Freighter wallet (Testnet)</span>
        </div>
        <div className="step-item">
          <span className="step-num-mini">2</span>
          <span>Send XLM or USDC to the address above</span>
        </div>
        <div className="step-item">
          <span className="step-num-mini">3</span>
          <span>Your donation appears below automatically</span>
        </div>
      </div>

      {/* Admin: Export Feedback Button */}
      {isAdmin && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", borderTop: "2px dashed var(--border-strong)" }}>
          <p style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Admin Tools</p>
          <button
            className="btn-secondary"
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
            onClick={() => downloadFeedbackCSV(`tulong-feedback-${Date.now()}.csv`)}
          >
            📥 Download All User Feedback (CSV)
          </button>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
            Exports feedback collected from the in-app modal (localStorage).
          </p>
        </div>
      )}
    </div>
  );
}
