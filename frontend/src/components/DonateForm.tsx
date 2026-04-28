// src/components/DonateForm.tsx
import { useState } from "react";
import { donate, donateXlm } from "../lib/stellar";
import { downloadFeedbackCSV } from "../lib/feedback";
import type { WalletState } from "../types";

type AssetType = "USDC" | "XLM";

interface Props {
  wallet: WalletState;
  isAdmin?: boolean;
  onConnect?: () => void;
}

export default function DonateForm({ wallet, isAdmin = false, onConnect }: Props) {
  const [asset, setAsset] = useState<AssetType>("USDC"); // Default to USDC (live contract supports it)
  const [donationAmount, setDonationAmount] = useState(0.1);
  const [donating, setDonating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  if (!wallet.connected) {
    return (
      <div className="donate-simple">
        <p className="donate-prompt">Connect your Freighter wallet to donate.</p>
        {onConnect && (
          <button className="btn-primary" onClick={onConnect}>
            Connect Freighter
          </button>
        )}
      </div>
    );
  }

  async function handleDonate(amount: number) {
    if (!wallet.address) return;
    setDonating(true);
    setStatusMsg(`Donating ${amount} ${asset}...`);
    try {
      let txHash: string;
      if (asset === "USDC") {
        txHash = await donate(wallet.address, amount);
      } else {
        txHash = await donateXlm(wallet.address, amount);
      }
      setStatusMsg(`✅ Success! Tx: ${txHash.slice(0, 14)}...`);
      setTimeout(() => setStatusMsg(""), 8000);
    } catch (err: any) {
      setStatusMsg(`❌ ${err.message || "Transaction failed"}`);
      console.error(err);
    } finally {
      setDonating(false);
    }
  }

  const amountsXlm = [0.1, 0.5, 1, 5];
  const amountsUsdc = [0.1, 0.5, 1, 5];

  return (
    <div className="donate-simple">
      <h3 className="form-h3">Donate to the Relief Fund</h3>
      <p className="form-desc">
        Choose asset and amount. Freighter will pop up for confirmation.
        Your donation appears in real-time below.
      </p>

      <div className="asset-toggle">
        <button
          type="button"
          className={`asset-btn ${asset === "XLM" ? "active" : ""}`}
          onClick={() => setAsset("XLM")}
        >
          XLM (Native)
        </button>
        <button
          type="button"
          className={`asset-btn ${asset === "USDC" ? "active" : ""}`}
          onClick={() => setAsset("USDC")}
        >
          USDC (Stablecoin)
        </button>
      </div>

      <div className="donate-amounts">
        {(asset === "XLM" ? amountsXlm : amountsUsdc).map((amt) => (
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
        {donating ? "Processing..." : `Donate $${donationAmount} ${asset}`}
      </button>

      {statusMsg && (
        <p className={`donate-status ${statusMsg.startsWith("✅") ? "success" : "error"}`}>
          {statusMsg}
        </p>
      )}

      <div className="donate-steps">
        <div className="step-item"><span className="step-num-mini">1</span><span>Select asset & amount</span></div>
        <div className="step-item"><span className="step-num-mini">2</span><span>Approve in Freighter</span></div>
        <div className="step-item"><span className="step-num-mini">3</span><span>Watch it appear in history</span></div>
      </div>

      {asset === "USDC" && (
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>
          ⚠️ First-time USDC donors: Add a USDC trustline in Freighter (Settings → Assets).
        </p>
      )}

      {asset === "XLM" && (
        <p style={{ fontSize: "0.8rem", color: "var(--red)", marginTop: "0.5rem", fontWeight: 700 }}>
          ⚠️ XLM donations require contract redeploy. Run: <code style={{background: "var(--off-white)", padding: "2px 6px", borderRadius: "4px"}}>node scripts/deploy-contract.js</code>
        </p>
      )}

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
        </div>
      )}
    </div>
  );
}
