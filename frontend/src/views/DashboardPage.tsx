// src/views/DashboardPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import StatsCard from "../components/StatsCard";
import DonateForm from "../components/DonateForm";
import WithdrawForm from "../components/WithdrawForm";
import ActivityFeed from "../components/ActivityFeed";
import {
  donate,
  declareEmergency,
  liftEmergency,
  getTotalDonated,
  getTotalWithdrawn,
  getBalance,
  isEmergency,
} from "../lib/stellar";
import type { WalletState, FundStats } from "../types";

interface Props {
  wallet: WalletState;
  onBack: () => void;
}

const QUICK_LINKS = [
  { label: "Stellar Expert", href: "https://stellar.expert/explorer/testnet", icon: "search" },
  { label: "Soroban SDK", href: "https://docs.rs/soroban-sdk", icon: "package" },
  { label: "Freighter", href: "https://freighter.app", icon: "link" },
];

export default function DashboardPage({ wallet, onBack }: Props) {
  const [stats, setStats] = useState<FundStats>({
    totalDonated: 0,
    totalWithdrawn: 0,
    balance: 0,
    isEmergency: false,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"donate" | "withdraw">("donate");
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [copiedAddr, setCopiedAddr] = useState(false);

  const activity = useQuery(api.fund.getActivityFeed);
  const recordDonation = useMutation(api.fund.recordDonation);
  const recordWithdrawal = useMutation(api.fund.recordWithdrawal);
  const recordEmergency = useMutation(api.fund.recordEmergencyEvent);

  function showToast(type: "success" | "error" | "info", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  const refreshStats = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [donated, withdrawn, balance, emergency] = await Promise.all([
        getTotalDonated(),
        getTotalWithdrawn(),
        getBalance(),
        isEmergency(),
      ]);
      setStats({ totalDonated: donated, totalWithdrawn: withdrawn, balance, isEmergency: emergency });
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to load stats:", err);
      if (!silent) showToast("error", "Failed to load on-chain stats. Check your connection.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshStats(true);
    const interval = setInterval(() => refreshStats(true), 30_000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  async function handleDonate(amount: number) {
    if (!wallet.address) return;
    setLoading(true);
    try {
      await donate(wallet.address, amount);
      await recordDonation({ donor: wallet.address, amount });
      await refreshStats(true);
      showToast("success", `Successfully donated ${amount} USDC! Transaction is on-chain.`);
    } catch (err) {
      showToast("error", "Donation failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(amount: number, purpose: string) {
    if (!wallet.address) return;
    setLoading(true);
    try {
      await recordWithdrawal({ coordinator: wallet.address, amount, purpose });
      await refreshStats(true);
      showToast("success", `Withdrew ${amount} USDC. Purpose logged on-chain.`);
    } catch (err) {
      showToast("error", "Withdrawal failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeclareEmergency() {
    if (!wallet.address) return;
    setLoading(true);
    try {
      await declareEmergency(wallet.address);
      await recordEmergency({ type: "emergency_declared", address: wallet.address });
      await refreshStats(true);
      showToast("info", "Emergency declared. Withdrawals are now enabled.");
    } catch (err) {
      showToast("error", "Failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLiftEmergency() {
    if (!wallet.address) return;
    setLoading(true);
    try {
      await liftEmergency(wallet.address);
      await recordEmergency({ type: "emergency_lifted", address: wallet.address });
      await refreshStats(true);
      showToast("success", "Emergency lifted. Fund returned to locked state.");
    } catch (err) {
      showToast("error", "Failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAddr() {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 1800);
    }
  }

  const utilizationPct = stats.totalDonated > 0
    ? Math.round((stats.totalWithdrawn / stats.totalDonated) * 100)
    : 0;

  const escrowPct = stats.totalDonated > 0
    ? Math.round((stats.balance / stats.totalDonated) * 100)
    : 0;

  return (
    <div className="dashboard-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-msg">{toast.msg}</span>
          <button className="toast-close" onClick={() => setToast(null)}>x</button>
        </div>
      )}

      {stats.isEmergency && (
        <div className="emergency-banner">
          <span className="emergency-icon">!</span>
          <strong>EMERGENCY ACTIVE</strong> - Relief fund withdrawals are enabled
          <button
            className="emergency-lift-btn"
            onClick={handleLiftEmergency}
            disabled={loading}
          >
            Lift Emergency
          </button>
        </div>
      )}

      <div className="dashboard">
        <header className="dash-header">
          <div className="dash-header-left">
            <button className="btn-ghost" onClick={onBack}>
              <span>&larr;</span> Home
            </button>
            <div className="dash-title-wrap">
              <h1 className="dash-title">TulongChain Dashboard</h1>
              <span className="dash-subtitle">Stellar Testnet - Soroban Contract</span>
            </div>
          </div>

          <div className="dash-header-right">
            <div className="quick-links">
              {QUICK_LINKS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="quick-link">
                  <span className={`icon-${icon}`}></span>
                  <span className="quick-link-label">{label}</span>
                </a>
              ))}
            </div>

            <div className="wallet-info">
              <div className="wallet-status">
                <span className="wallet-dot" />
                Connected
              </div>
              <button
                className="address-badge-btn"
                onClick={handleCopyAddr}
                title="Click to copy full address"
              >
                {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
                <span className="copy-mini">{copiedAddr ? "OK" : "Copy"}</span>
              </button>
            </div>

            <button
              className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
              onClick={() => refreshStats(false)}
              disabled={refreshing}
              title="Refresh on-chain data"
            >
              R
            </button>
          </div>
        </header>

        <div className="stats-section">
          <div className="stats-grid">
            <StatsCard
              label="Total Donated"
              value={`${stats.totalDonated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
              icon="$"
              highlight={false}
            />
            <StatsCard
              label="Total Withdrawn"
              value={`${stats.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
              icon="out"
              highlight={false}
            />
            <StatsCard
              label="Available Balance"
              value={`${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
              icon="bank"
              highlight={true}
            />
            <StatsCard
              label="Emergency Status"
              value={stats.isEmergency ? "ACTIVE" : "Normal"}
              icon="warn"
              highlight={false}
            />
          </div>

          <div className="analytics-bar">
            <div className="analytics-item">
              <span className="analytics-label">Fund utilization</span>
              <div className="analytics-track">
                <div className="analytics-fill analytics-fill-coral" style={{ width: `${utilizationPct}%` }} />
              </div>
              <span className="analytics-pct">{utilizationPct}%</span>
            </div>
            <div className="analytics-divider" />
            <div className="analytics-item">
              <span className="analytics-label">In escrow</span>
              <div className="analytics-track">
                <div className="analytics-fill analytics-fill-leaf" style={{ width: `${escrowPct}%` }} />
              </div>
              <span className="analytics-pct">{escrowPct}%</span>
            </div>
            <div className="analytics-divider" />
            <div className="analytics-meta">
              <span className="analytics-label">Last refreshed</span>
              <span className="analytics-time">{lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="actions-panel">
          <div className="tabs-wrap">
            <div className="tabs-header">
              <button
                className={`tab-btn ${tab === "donate" ? "tab-btn-active" : ""}`}
                onClick={() => setTab("donate")}
              >
                <span className="tab-icon">$</span>
                Donate USDC
              </button>
              <button
                className={`tab-btn ${tab === "withdraw" ? "tab-btn-active" : ""}`}
                onClick={() => setTab("withdraw")}
              >
                <span className="tab-icon">K</span>
                Admin - Withdraw
              </button>
            </div>

            <div className="tab-body">
              {tab === "donate" && (
                <>
                  <div className="panel-info">
                    <span className="panel-info-icon">i</span>
                    Funds are locked in the Soroban escrow contract until an emergency is declared by the admin. All transactions are recorded on-chain.
                  </div>
                  <DonateForm onDonate={handleDonate} loading={loading} />
                </>
              )}
              {tab === "withdraw" && (
                <>
                  <div className="panel-info panel-info-warn">
                    <span className="panel-info-icon">!</span>
                    Admin-only. Withdrawals require an active emergency declaration. Purpose is logged immutably on-chain.
                  </div>
                  <WithdrawForm
                    onWithdraw={handleWithdraw}
                    onDeclareEmergency={handleDeclareEmergency}
                    isEmergency={stats.isEmergency}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>

          <div className="contract-state-panel">
            <div className="csp-title">Contract State</div>
            <div className="csp-rows">
              <div className="csp-row">
                <span className="csp-key">Network</span>
                <span className="csp-val csp-network">Stellar Testnet</span>
              </div>
              <div className="csp-row">
                <span className="csp-key">Emergency</span>
                <span className={`csp-val ${stats.isEmergency ? "csp-emergency" : "csp-normal"}`}>
                  {stats.isEmergency ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="csp-row">
                <span className="csp-key">Withdrawals</span>
                <span className={`csp-val ${stats.isEmergency ? "csp-enabled" : "csp-locked"}`}>
                  {stats.isEmergency ? "Enabled" : "Locked"}
                </span>
              </div>
              <div className="csp-row">
                <span className="csp-key">Token</span>
                <span className="csp-val">USDC (SEP-41)</span>
              </div>
              <div className="csp-row">
                <span className="csp-key">Standard</span>
                <span className="csp-val">Soroban - Rust</span>
              </div>
            </div>
            <a
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              rel="noreferrer"
              className="csp-explorer-btn"
            >
              View on Explorer -&gt;
            </a>
          </div>
        </div>

        <div className="activity-section">
          <div className="activity-header">
            <div className="activity-title">
              <span>A</span> Activity Feed
            </div>
            <div className="activity-count">
              {activity?.length ?? 0} events
            </div>
          </div>
          <ActivityFeed items={activity ?? []} />
        </div>

        <div className="dash-footer">
          <span>TulongChain - Stellar Philippines UniTour 2026 - UE Caloocan</span>
          <span className="dash-footer-note">All transactions are recorded on the Stellar blockchain and cannot be modified.</span>
        </div>
      </div>
    </div>
  );
}