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
      <h3 className="form-h3">Donate XLM to the Relief Fund</h3>
      <p className="form-desc">
        Your XLM will be sent directly to the Soroban escrow contract on Stellar Testnet.
        Every transaction is traceable on-chain.
      </p>
      <p className="form-desc" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Donation address: <span style={{ fontFamily: "monospace", color: "var(--yellow)" }}>
          {CONFIG.contractId.slice(0, 8)}...{CONFIG.contractId.slice(-6)}
        </span>
      </p>

      <div className="quick-amounts">
        {QUICK_AMOUNTS.map((a) => (
          <button key={a} className="quick-btn" onClick={() => setAmount(String(a))}>
            {a} XLM
          </button>
        ))}
      </div>

      <div className="input-row">
        <input
          type="number"
          placeholder="Enter XLM amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.1"
          step="0.1"
        />
        <span className="input-unit">XLM</span>
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
         {loading ? (
           <>
             <span className="spinner"></span>
             Processing...
           </>
         ) : (
           "Donate XLM via Freighter"
         )}
      </button>
    </div>
  );
}