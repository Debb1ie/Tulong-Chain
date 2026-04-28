// src/views/DashboardPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import StatsCard from "../components/StatsCard";
import DonateForm from "../components/DonateForm";
import TransactionHistory from "../components/TransactionHistory";
import ActivityFeed from "../components/ActivityFeed";
import {
  getTotalDonated,
  getTotalWithdrawn,
  getBalance,
  isEmergency,
} from "../lib/stellar";
import { WrongNetworkError, AccountNotFundedError } from "../lib/freighter";
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
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [contractXlmBalance, setContractXlmBalance] = useState<string>("0");

  const activity = useQuery(api.fund.getActivityFeed);

  const refreshStats = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [donated, withdrawn, balance, emergency] = await Promise.all([
        getTotalDonated(!silent),
        getTotalWithdrawn(!silent),
        getBalance(!silent),
        isEmergency(!silent),
      ]);
      setStats({ totalDonated: donated, totalWithdrawn: withdrawn, balance, isEmergency: emergency });
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

        <div className="donate-section">
          <DonateForm wallet={wallet} />
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
          <span className="dash-footer-note">All transactions are recorded on-chain and publicly verifiable.</span>
        </div>
      </div>
    </div>
  );
}
