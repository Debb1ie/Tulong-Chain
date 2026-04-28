// src/components/DonateForm.tsx
import { useState } from "react";
import { CONFIG } from "../lib/config";

interface Props {
  wallet: {
    connected: boolean;
    address: string | null;
  };
}

export default function DonateForm({ wallet }: Props) {
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
    </div>
  );
}
