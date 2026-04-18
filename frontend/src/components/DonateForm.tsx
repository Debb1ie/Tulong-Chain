// src/components/DonateForm.tsx
import { useState } from "react";

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
      <h3 className="form-h3">Donate to the Relief Fund</h3>
      <p className="form-desc">
        Your USDC will be locked on-chain until an emergency is declared.
        Every centavo is traceable.
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
        {loading ? "Processing..." : "Donate via Freighter"}
      </button>
    </div>
  );
}