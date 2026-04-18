# TulongChain — Architecture

## Stack

```
Browser (React + Vite + TypeScript)
  |-- Freighter Wallet API       (tx signing)
  |-- @stellar/stellar-sdk       (transaction building, RPC calls)
  |-- Convex                     (real-time off-chain activity mirror)
  |-- Soroban RPC                (on-chain reads and writes)

Stellar Testnet
  |-- TulongChain Soroban Contract   (escrow + emergency logic)
  |-- USDC Token Contract            (SEP-41 compatible token)
```

## Key Design Decisions

**No backend server.** All fund state (balances, donations, withdrawals) is authoritative on-chain.
Convex is used only as a real-time mirror for UI responsiveness and activity feeds.

**Emergency gating.** Withdrawals are disabled by default. The admin must call `declare_emergency`
before any USDC can leave the contract. This prevents unauthorized access.

**USDC stablecoin.** Using USDC instead of XLM eliminates price volatility risk for donors and recipients.

## Data Flow — Donation

```
User clicks "Donate"
  → Freighter prompts for signature
  → stellar.ts builds TransactionBuilder operation
  → Contract `donate()` called → USDC transferred to contract
  → Convex `recordDonation` mutation called (off-chain mirror)
  → UI refreshes stats from on-chain reads
```

## Data Flow — Emergency Withdrawal

```
Admin clicks "Declare Emergency"
  → Contract `declare_emergency()` sets Emergency = true
Admin clicks "Withdraw"
  → Contract checks: Emergency == true && caller == admin
  → USDC transferred to coordinator
  → Convex `recordWithdrawal` mutation called
  → UI balance updates
```

## Contract State

| Key | Type | Description |
|---|---|---|
| Admin | Address | Contract deployer / coordinator |
| TotalDonated | i128 | Cumulative USDC donated (stroops) |
| TotalWithdrawn | i128 | Cumulative USDC withdrawn (stroops) |
| Emergency | bool | Whether withdrawals are enabled |
| Donations | Vec<Donation> | All donation records |
| Withdrawals | Vec<Withdrawal> | All withdrawal records |
