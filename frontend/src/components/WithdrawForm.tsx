// src/components/WithdrawForm.tsx
import { useState } from "react";

interface Props {
  onWithdraw: (amount: number, purpose: string) => void;
  onDeclareEmergency: () => void;
  isEmergency: boolean;
  loading: boolean;
}

export default function WithdrawForm({ onWithdraw, onDeclareEmergency, isEmergency, loading }: Props) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  function handleSubmit() {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!purpose.trim()) {
      alert("Please enter a purpose for this withdrawal.");
      return;
    }
    onWithdraw(val, purpose);
    setAmount("");
    setPurpose("");
  }

  return (
    <div>
      <h3 className="form-h3">Admin - Emergency Withdrawal</h3>
      <p className="form-desc">
        Only the contract admin can withdraw. An emergency must be active.
      </p>

      {!isEmergency && (
        <div className="admin-panel">
          <p>No emergency is currently active.</p>
          <button
            className="btn-danger"
            onClick={onDeclareEmergency}
            disabled={loading}
          >
            {loading ? "Processing..." : "Declare Emergency"}
          </button>
        </div>
      )}

      {isEmergency && (
        <>
          <div className="input-row">
            <input
              type="number"
              placeholder="Amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
            />
            <span className="input-unit">USDC</span>
          </div>

          <input
            type="text"
            className="purpose-input"
            placeholder="Purpose (e.g. Typhoon relief - Region IV-A)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Withdraw Relief Funds"}
          </button>
        </>
      )}
    </div>
  );
}