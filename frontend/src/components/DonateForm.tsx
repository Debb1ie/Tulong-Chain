// src/components/DonateForm.tsx
import { useState } from "react";
import { donate } from "../lib/stellar";
import { downloadFeedbackCSV } from "../lib/feedback";
import type { WalletState } from "../types";

interface Props {
  wallet: WalletState;
  isAdmin?: boolean;
}

export default function DonateForm({ wallet, isAdmin = false }: Props) {
  const [donationAmount, setDonationAmount] = useState(0.1);
  const [donating, setDonating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  if (!wallet.connected) {
    return (
      <div className="donate-simple">
        <p className="donate-prompt">Connect your Freighter wallet to donate.</p>
      </div>
    );
  }

  async function handleDonate(amount: number) {
    if (!wallet.address) return;
    setDonating(true);
    setStatusMsg(`Donating ${amount} USDC...`);
    try {
      const txHash = await donate(wallet.address, amount);
      setStatusMsg(`✅ Success! Tx: ${txHash.slice(0, 14)}...`);
      setTimeout(() => setStatusMsg(""), 8000);
    } catch (err: any) {
      setStatusMsg(`❌ ${err.message || "Transaction failed"}`);
    } finally {
      setDonating(false);
    }
  }

  return (
    <div className="donate-simple">
      <h3 className="form-h3">Donate USDC to the Fund</h3>
      <p className="form-desc">
        Choose an amount and click Donate. Freighter will pop up for confirmation.
        Your donation appears in real-time below.
      </p>

      <div className="donate-amounts">
        {[0.1, 0.5, 1, 5].map((amt) => (
          <button
            key={amt}
            className={`donate-amount-btn ${donationAmount === amt ? "active" : ""}`}
            onClick={() => setDonationAmount(amt)}
            disabled={donating}
          >
            ${amt}
          </button>
        ))}
      </div>

      <button
        className="btn-primary donate-submit"
        onClick={() => handleDonate(donationAmount)}
        disabled={donating}
      >
        {donating ? "Processing..." : `Donate $${donationAmount} USDC`}
      </button>

      {statusMsg && (
        <p className="donate-status">{statusMsg}</p>
      )}

      <div className="donate-steps">
        <div className="step-item"><span className="step-num-mini">1</span><span>Select amount</span></div>
        <div className="step-item"><span className="step-num-mini">2</span><span>Approve in Freighter</span></div>
        <div className="step-item"><span className="step-num-mini">3</span><span>Watch it appear in history</span></div>
      </div>

      {isAdmin && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", borderTop: "2px dashed var(--border-strong)" }}>
          <p style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Admin Tools</p>
          <button className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }} onClick={() => downloadFeedbackCSV(`tulong-feedback-${Date.now()}.csv`)}>
            📥 Download Feedback (CSV)
          </button>
        </div>
      )}
    </div>
  );
}
