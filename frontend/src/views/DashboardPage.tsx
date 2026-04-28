// src/views/DashboardPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import StatsCard from "../components/StatsCard";
import DonateForm from "../components/DonateForm";
import TransactionHistory from "../components/TransactionHistory";
import ActivityFeed from "../components/ActivityFeed";
import FeedbackModal, { type FeedbackData } from "../components/FeedbackModal";
import {
  getTotalDonated,
  getTotalWithdrawn,
  getBalance,
  isEmergency,
  isPaused,
  getTimelockDuration,
  getTimelockInfo,
  pause,
  unpause,
  setTimelock,
} from "../lib/stellar";
import { CONFIG } from "../lib/config";
import type { WalletState, FundStats } from "../types";

interface Props {
  wallet: WalletState;
  onBack: () => void;
}

export default function DashboardPage({ wallet, onBack }: Props) {
  const [stats, setStats] = useState<FundStats>({
    totalDonated: 0,
    totalWithdrawn: 0,
    balance: 0,
    isEmergency: false,
  });
  const [paused, setPaused] = useState<boolean>(false);
  const [timelockDuration, setTimelockDuration] = useState<number>(0);
  const [timelockInfo, setTimelockInfo] = useState<{ declared_at: number; activates_at: number }>({
    declared_at: 0,
    activates_at: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [contractXlmBalance, setContractXlmBalance] = useState<string>("0");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const activity = useQuery(api.fund.getActivityFeed);

  const refreshStats = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [donated, withdrawn, balance, emergency, pausedState, tlDuration, tlInfo] = await Promise.all([
        getTotalDonated(!silent),
        getTotalWithdrawn(!silent),
        getBalance(!silent),
        isEmergency(!silent),
        isPaused(!silent),
        getTimelockDuration(!silent),
        getTimelockInfo(!silent),
      ]);
      setStats({ totalDonated: donated, totalWithdrawn: withdrawn, balance, isEmergency: emergency });
      setPaused(pausedState);
      setTimelockDuration(tlDuration);
      setTimelockInfo(tlInfo);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshStats(true);
    const interval = setInterval(() => refreshStats(true), 30_000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  // Show feedback modal on first visit (once per wallet)
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      const key = `tulong_feedback_submitted_${wallet.address}`;
      const alreadySubmitted = localStorage.getItem(key);
      if (!alreadySubmitted) {
        // Show modal after a short delay (2 seconds)
        const timer = setTimeout(() => setShowFeedbackModal(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [wallet.connected, wallet.address]);

  // Fetch contract's native XLM balance from Horizon
  useEffect(() => {
    async function fetchXlmBalance() {
      try {
        const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${CONFIG.contractId}`);
        if (!res.ok) throw new Error(`Horizon error ${res.status}`);
        const data = await res.json();
        const native = data.balances?.find((b: any) => b.asset_type === "native");
        setContractXlmBalance(native ? native.balance : "0");
      } catch (err) {
        console.error("Failed to fetch XLM balance:", err);
      }
    }
    fetchXlmBalance();
    const interval = setInterval(fetchXlmBalance, 15000);
    return () => clearInterval(interval);
  }, []);

  // Admin actions
  const handlePause = async () => {
    if (!wallet.address) return;
    await pause(wallet.address);
    refreshStats(false);
  };

  const handleUnpause = async () => {
    if (!wallet.address) return;
    await unpause(wallet.address);
    refreshStats(false);
  };

  const handleSetTimelock = async (seconds: number) => {
    if (!wallet.address) return;
    await setTimelock(wallet.address, seconds);
    refreshStats(false);
  };

  const now = Math.floor(Date.now() / 1000);
  const isTimelockPending = !stats.isEmergency && timelockInfo.activates_at > now;

  const handleFeedbackSubmit = (data: FeedbackData) => {
    // Save to localStorage
    const key = `tulong_feedback_submitted_${wallet.address}`;
    localStorage.setItem(key, "true");

    // Append to feedback list in localStorage
    const feedbackList = JSON.parse(localStorage.getItem("tulong_feedback_all") || "[]");
    feedbackList.push(data);
    localStorage.setItem("tulong_feedback_all", JSON.stringify(feedbackList));

    console.log("Feedback submitted:", data);
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <div className="dash-header-left">
          <button className="btn-ghost" onClick={onBack}>
            <span>&larr;</span> Home
          </button>
          <div className="dash-title-wrap">
            <h1 className="dash-title">TulongChain Dashboard</h1>
            <span className="dash-subtitle">Stellar Testnet — Live Monitoring</span>
          </div>
        </div>

        <div className="dash-header-right">
          <div className="wallet-info">
            <div className="wallet-status">
              <span className="wallet-dot" />
              Connected
            </div>
            <span className="address-badge-btn">
              {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
            </span>
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

      {stats.isEmergency && (
        <div className="emergency-banner">
          <span className="emergency-icon">!</span>
          <strong>EMERGENCY ACTIVE</strong> — Withdrawals enabled
        </div>
      )}

      {paused && (
        <div className="paused-banner">
          <span className="pause-icon">⏸</span>
          <strong>CONTRACT PAUSED</strong> — All operations halted
        </div>
      )}

      {isTimelockPending && (
        <div className="timelock-banner">
          <span className="timelock-icon">⏱</span>
          Emergency declared — activates at{" "}
          {new Date(timelockInfo.activates_at * 1000).toLocaleString()}
        </div>
      )}

      <div className="dashboard">
        <div className="stats-section">
          <div className="stats-grid">
            <StatsCard
              label="Total Donated (USDC)"
              value={`${stats.totalDonated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
              icon="$"
              highlight={false}
            />
            <StatsCard
              label="Total Withdrawn (USDC)"
              value={`${stats.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
              icon="out"
              highlight={false}
            />
            <StatsCard
              label="Available Balance (USDC)"
              value={`${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
              icon="bank"
              highlight={true}
            />
            <StatsCard
              label="Contract XLM Balance"
              value={`${parseFloat(contractXlmBalance).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} XLM`}
              icon="star"
              highlight={false}
            />
          </div>
        </div>

        <div className="admin-panel">
          <h4>Admin Tools</h4>
          <div className="admin-controls">
            <div className="control-group">
              <label>Emergency Timelock (seconds, min 3600)</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  id="timelock-input"
                  type="number"
                  defaultValue={timelockDuration}
                  min="3600"
                  placeholder="e.g. 3600"
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-small"
                  onClick={() => {
                    const val = Number((document.getElementById("timelock-input") as HTMLInputElement).value);
                    if (val >= 3600) handleSetTimelock(val);
                  }}
                >
                  Set Timelock
                </button>
              </div>
            </div>

            <div className="control-group">
              {!paused ? (
                <button className="btn-small btn-warn" onClick={handlePause} disabled={refreshing}>
                  Pause Contract
                </button>
              ) : (
                <button className="btn-small btn-primary" onClick={handleUnpause} disabled={refreshing}>
                  Unpause
                </button>
              )}
            </div>
          </div>
          <small className="admin-note">
            These controls affect the entire contract. Changes are on-chain.
          </small>
        </div>

        <div className="donate-section">
          <DonateForm wallet={wallet} isAdmin={true} />
        </div>

        <div className="history-section">
          <TransactionHistory />
        </div>

        <div className="activity-section">
          <div className="activity-header">
            <div className="activity-title">
              <span>A</span> Contract Activity
            </div>
            <div className="activity-count">
              {activity?.length ?? 0} events
            </div>
          </div>
          <ActivityFeed items={activity ?? []} />
        </div>

        <div className="dash-footer">
          <span>TulongChain — Stellar Testnet</span>
          <span className="dash-footer-note">
            All transactions are recorded on-chain and publicly verifiable.
          </span>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        wallet={wallet}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}