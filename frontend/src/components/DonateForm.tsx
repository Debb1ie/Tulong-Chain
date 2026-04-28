// src/components/DonateForm.tsx
import { useState } from "react";
import { CONFIG } from "../lib/config";

interface Props {
  onDonate: (amount: number) => void;
  loading: boolean;
}

const QUICK_AMOUNTS = [10, 25, 50, 100];

export default function DonateForm({ onDonate, loading }: Props) {
  const [amount, setAmount] = useState("");

  function handleSubmit() {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    onDonate(val);
    setAmount("");
  }

  return (
    <div>
      <h3 className="form-h3">Donate USDC to the Relief Fund</h3>
      <p className="form-desc">
        Your USDC will be locked in the Soroban escrow contract until an emergency is declared.
        Every centavo is traceable on-chain.
      </p>
      <p className="form-desc" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Donation contract address: <span style={{ fontFamily: "monospace", color: "var(--yellow)", wordBreak: "break-all" }}>
          {CONFIG.contractId}
        </span>
      </p>

      <div className="quick-amounts">
        {QUICK_AMOUNTS.map((a) => (
          <button key={a} className="quick-btn" onClick={() => setAmount(String(a))}>
            ${a}
          </button>
        ))}
      </div>

      <div className="input-row">
        <input
          type="number"
          placeholder="Enter USDC amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
        />
        <span className="input-unit">USDC</span>
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
         {loading ? (
           <>
             <span className="spinner"></span>
             Processing...
           </>
         ) : (
           "Donate USDC via Freighter"
         )}
      </button>
    </div>
  );
}