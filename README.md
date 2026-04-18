# 🫂 TulongChain

> Community disaster relief fund for Filipino families — transparent, instant, on-chain.

Built on **Stellar + Soroban** for the Stellar Philippines UniTour Bootcamp 2026.

---

## Problem

Natural disasters hit the Philippines every year. Relief fundraising is fragmented across GCash, 
bank transfers, and social media. Donors can't verify their money reached the right people.
Relief coordinators deal with slow settlement and high fees.

## Solution

TulongChain lets donors send USDC directly into a Soroban smart contract.
Funds stay locked until a verified coordinator declares an emergency.
Every peso donated and every withdrawal is public on Stellar Expert.
Settlement in **under 5 seconds**, fees under **$0.01**.

---

## Demo Flow

1. Connect Freighter wallet (set to Testnet)
2. Enter a USDC amount and click **Donate**
3. Freighter prompts for signature — funds lock in the contract
4. Admin declares emergency → withdrawal becomes available
5. Coordinator withdraws USDC with a stated purpose
6. All activity visible on the live dashboard

---

## Architecture

```
Browser (React + Vite)
  |-- Freighter Wallet API      (signing)
  |-- @stellar/stellar-sdk      (transaction building, RPC)
  |-- Convex                    (real-time off-chain state sync)
  |-- Soroban RPC               (on-chain reads and writes)

Stellar Testnet
  |-- TulongChain Soroban Contract  (escrow + emergency logic)
  |-- USDC Token Contract           (SEP-41 token)
```

No traditional backend. All fund state lives on-chain. Convex mirrors it for real-time UI.

---

## Project Structure

```
tulongchain/
├── contracts/
│   ├── src/
│   │   ├── lib.rs          # Soroban escrow contract
│   │   └── test.rs         # 5 contract unit tests
│   └── Cargo.toml
├── frontend/
│   ├── convex/             # Real-time off-chain sync
│   │   ├── schema.ts
│   │   └── fund.ts
│   ├── src/
│   │   ├── lib/
│   │   │   ├── stellar.ts  # Contract invocations
│   │   │   ├── freighter.ts # Wallet connect & signing
│   │   │   └── config.ts   # Environment constants
│   │   ├── views/          # Page-level components
│   │   ├── components/     # Shared UI components
│   │   ├── types/          # TypeScript interfaces
│   │   └── styles/         # Global CSS
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── requirements.md
│   └── architecture.md
└── README.md
```

---

## Stellar Features Used

| Feature | Usage |
|---|---|
| Soroban smart contracts | Escrow logic — donate, lock, emergency, withdraw |
| USDC on Stellar | Stablecoin donations, no XLM volatility |
| Trustlines | Recipient must trust USDC before receiving |
| Soroban Events | Emitted on every donation / withdrawal |

---

## Smart Contract

Deployed on Stellar Testnet:
```
<YOUR_CONTRACT_ID_HERE>
```

Explorer: `https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>`

### Contract Functions

| Function | Caller | Description |
|---|---|---|
| `initialize(admin)` | Deployer | Set up contract with admin address |
| `donate(donor, token, amount)` | Anyone | Lock USDC into the fund |
| `declare_emergency()` | Admin | Enable relief withdrawals |
| `lift_emergency()` | Admin | Disable withdrawals |
| `withdraw(coordinator, token, amount, purpose)` | Admin | Send USDC to coordinator |
| `get_balance()` | Anyone | Read current fund balance |
| `is_emergency()` | Anyone | Check emergency status |
| `get_donations()` | Anyone | List all donations |
| `get_withdrawals()` | Anyone | List all withdrawals |

---

## Setup

### Prerequisites

- Rust (latest stable) + WASM target
- Stellar CLI v25+
- Node.js 18+
- Freighter wallet (set to **Testnet**)

### Smart Contract

```bash
# Install Rust WASM target
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Run tests (must pass 5+)
cd contracts
cargo test

# Generate deployer identity
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet

# Build
cargo build --target wasm32-unknown-unknown --release

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source my-key \
  --network testnet
```

Copy the Contract ID (starts with `C...`) into your `.env`.

### Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your Contract ID and Convex URL in .env

npm install
npx convex dev       # In one terminal
npm run dev          # In another terminal
```

App runs at `http://localhost:5173`

---

## Bootcamp Submission Checklist

- [ ] `cargo test` passes with **5+ tests**
- [ ] Contract deployed to Stellar Testnet
- [ ] Contract ID recorded (starts with `C...`)
- [ ] GitHub repo is **public**
- [ ] Rise In submission completed

**Submit at:** https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan

| Field | Value |
|---|---|
| GitHub Repository | `https://github.com/<your-username>/tulongchain` |
| Contract ID | `<YOUR_CONTRACT_ID>` |
| Stellar Expert Link | `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>` |
| Short Description | TulongChain is a community disaster relief fund on Stellar. Donors send USDC into a Soroban smart contract escrow that only releases funds when a verified coordinator declares a disaster emergency. Built for Filipino communities. |

---

## Why Stellar

No other chain offers sub-cent fees with native USDC support and built-in compliance hooks.
Stellar's 3-5 second finality means relief funds reach coordinators in real time — not days.
The escrow pattern is reusable for any transparent community fund, not just disaster relief.

---

*Built for Stellar Philippines UniTour 2026 — University of East Caloocan*
