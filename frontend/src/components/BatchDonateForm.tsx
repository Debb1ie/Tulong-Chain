// src/components/BatchDonateForm.tsx
import { useState } from "react";
import { batchDonate } from "../lib/stellar";
import type { WalletState } from "../types";

type AssetType = "USDC" | "XLM";

interface BatchItem {
  id: number;
  asset: AssetType;
  amount: number;
}

interface Props {
  wallet: WalletState;
  onConnect?: () => void;
}

const AMOUNT_PRESETS = [0.1, 0.5, 1, 5, 10, 25, 50, 100];

export default function BatchDonateForm({ wallet, onConnect }: Props) {
  const [items, setItems] = useState<BatchItem[]>([
    { id: Date.now(), asset: "USDC", amount: 0.1 }
  ]);
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

  function addItem() {
    setItems(prev => [
      ...prev,
      { id: Date.now(), asset: "USDC", amount: 0.1 }
    ]);
  }

  function removeItem(id: number) {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }

  function updateItem(id: number, updates: Partial<BatchItem>) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }

  async function handleBatchDonate() {
    if (!wallet.address) return;
    setDonating(true);
    setStatusMsg("Processing batch donation...");

    try {
      // Convert items to batch format expected by contract
      const batches = items.map(item => ({
        token: item.asset === "USDC" ? "USDC" : "XLM",
        amount: item.amount,
        asset: item.asset === "USDC" ? 1 : 0 // 0 = native/XLM, 1 = token/USDC
      }));

      const txHash = await batchDonate(wallet.address, batches);
      
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      setStatusMsg(`✅ Batch donation of ${total.toFixed(2)} USDC/XLM successful! Tx: ${txHash.slice(0, 14)}...`);
      setTimeout(() => setStatusMsg(""), 10000);
    } catch (err: any) {
      setStatusMsg(`❌ ${err.message || "Batch donation failed"}`);
      console.error(err);
    } finally {
      setDonating(false);
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="donate-simple batch-donate-form">
      <h3 className="form-h3">Batch Donation (Advanced)</h3>
      <p className="form-desc">
        Donate to multiple causes or token types in a single atomic transaction.
        Add up to 50 entries per batch.
      </p>

      <div className="batch-items">
        {items.map((item, index) => (
          <div key={item.id} className="batch-item-row">
            <div className="batch-item-number">#{index + 1}</div>
            
            <div className="batch-asset-select">
              <select
                value={item.asset}
                onChange={(e) => updateItem(item.id, { asset: e.target.value as AssetType })}
                disabled={donating}
              >
                <option value="USDC">USDC</option>
                <option value="XLM">XLM</option>
              </select>
            </div>

            <div className="batch-amount-select">
              {AMOUNT_PRESETS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`batch-amount-btn ${item.amount === amt ? "active" : ""}`}
                  onClick={() => updateItem(item.id, { amount: amt })}
                  disabled={donating}
                >
                  ${amt}
                </button>
              ))}
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={item.amount}
                onChange={(e) => updateItem(item.id, { amount: parseFloat(e.target.value) || 0 })}
                disabled={donating}
                className="batch-custom-amount"
                placeholder="Custom"
              />
            </div>

            {items.length > 1 && (
              <button
                type="button"
                className="batch-remove-btn"
                onClick={() => removeItem(item.id)}
                disabled={donating}
                title="Remove this entry"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="batch-add-btn"
        onClick={addItem}
        disabled={donating}
      >
        + Add Another Entry
      </button>

      <div className="batch-summary">
        <div className="batch-total">
          Total: <strong>{totalAmount.toFixed(2)}</strong> {items.some(i => i.asset === "XLM") ? "(mixed assets)" : "USDC"}
        </div>
        <div className="batch-count">{items.length} entr{items.length === 1 ? "y" : "ies"}</div>
      </div>

      <button
        className="btn-primary donate-submit batch-submit"
        onClick={handleBatchDonate}
        disabled={donating || items.length === 0}
      >
        {donating ? "Processing Batch..." : `Donate Batch (${items.length} entries)`}
      </button>

      {statusMsg && (
        <p className={`donate-status ${statusMsg.startsWith("✅") ? "success" : "error"}`}>
          {statusMsg}
        </p>
      )}

      <div className="batch-info">
        <details>
          <summary>What is batch donation?</summary>
          <p>
            Batch donation lets you send multiple donations in a single on-chain transaction.
            Perfect for:
          </p>
          <ul>
            <li>Donating to multiple relief categories at once (food, water, medicine)</li>
            <li>Mixing XLM and USDC in one transaction</li>
            <li>Organizations managing multiple fund allocations</li>
          </ul>
          <p>
            <strong>Note:</strong> All entries succeed or fail together (atomic). Max 50 entries per batch.
          </p>
        </details>
      </div>

      <style>{`
        .batch-donate-form {
          max-width: 600px;
        }
        .batch-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 1rem 0;
        }
        .batch-item-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--off-white);
          border: 2px solid var(--border-strong);
          border-radius: 8px;
        }
        .batch-item-number {
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--muted);
          min-width: 2rem;
        }
        .batch-asset-select select {
          padding: 0.5rem;
          border: 2px solid var(--black);
          border-radius: 6px;
          font-weight: 600;
          background: white;
          min-width: 80px;
        }
        .batch-amount-select {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          flex: 1;
        }
        .batch-amount-btn {
          padding: 0.35rem 0.6rem;
          font-size: 0.8rem;
          border: 2px solid var(--border-strong);
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        .batch-amount-btn.active {
          background: var(--yellow);
          border-color: var(--black);
          font-weight: 700;
        }
        .batch-custom-amount {
          width: 70px;
          padding: 0.35rem;
          border: 2px solid var(--border-strong);
          border-radius: 4px;
          font-size: 0.85rem;
        }
        .batch-remove-btn {
          width: 32px;
          height: 32px;
          border: 2px solid var(--red);
          background: white;
          color: var(--red);
          font-size: 1.2rem;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .batch-remove-btn:hover {
          background: var(--red);
          color: white;
        }
        .batch-add-btn {
          width: 100%;
          padding: 0.75rem;
          border: 2px dashed var(--border-strong);
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-weight: 600;
          border-radius: 8px;
          margin-top: 0.5rem;
        }
        .batch-add-btn:hover {
          border-color: var(--yellow);
          color: var(--black);
        }
        .batch-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--off-white);
          border-left: 4px solid var(--yellow);
          margin: 1rem 0;
          font-size: 0.95rem;
        }
        .batch-total strong {
          font-size: 1.1rem;
          color: var(--violet);
        }
        .batch-count {
          font-size: 0.8rem;
          color: var(--muted);
        }
        .batch-submit {
          width: 100%;
        }
        .batch-info {
          margin-top: 1rem;
        }
        .batch-info details {
          font-size: 0.85rem;
          color: var(--muted);
          cursor: pointer;
        }
        .batch-info summary {
          font-weight: 600;
          color: var(--black);
        }
        .batch-info ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .batch-info li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
