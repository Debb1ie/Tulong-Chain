# TulongChain 

**Community disaster relief fund for Filipino families — transparent, instant, on-chain.**

Built on **Stellar + Soroban** · Stellar Philippines UniTour Bootcamp 2026

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-7F77DD?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-534AB7?style=flat-square)](https://soroban.stellar.org)
[![Rust](https://img.shields.io/badge/Language-Rust-D85A30?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![USDC](https://img.shields.io/badge/Token-USDC-2775CA?style=flat-square)](https://www.circle.com/usdc)
[![Tests](https://img.shields.io/badge/Tests-5%20passing-639922?style=flat-square)](#tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-888780?style=flat-square)](LICENSE)

---

##  Live Links

| Resource | Link |
|---|---|
| **Frontend (Vercel)** | [tulong-chain.vercel.app](https://tulong-chain.vercel.app/) |
| **GitHub Repository** | [github.com/Debb1ie/Tulong-Chain](https://github.com/Debb1ie/Tulong-Chain) |
| **Convex Dashboard** | [dashboard.convex.dev/t/deborahgrace0118/frontend-9d9b7/exciting-hawk-153](https://dashboard.convex.dev/t/deborahgrace0118/frontend-9d9b7/exciting-hawk-153) |
| **Stellar Expert (Testnet)** | [View Contract →](https://stellar.expert/explorer/testnet/contract/CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO) |

### Deployed Contract (Stellar Testnet)

```
CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO
```

---

##  The Problem

Natural disasters hit the Philippines every typhoon season — yet relief fundraising still runs through GCash group chats, manual bank transfers, and screenshots shared on Facebook.

| Pain Point | Reality |
|---|---|
| Settlement time | 3–5 business days |
| Transfer fees | 5–10% per donation lost |
| Transparency | Screenshot-based trust |
| Emergency speed | Coordinators wait for bank clearance windows |

Typhoon victims wait **days** for food and medicine while coordinators lose a cut of every peso to fees, exchange spreads, and manual tracking errors.

---

##  The Solution

TulongChain lets anyone donate USDC directly into a **Soroban smart contract escrow**. Funds stay locked on-chain until a verified coordinator declares a disaster emergency. Every donation and withdrawal is permanently traceable on Stellar Expert — no middlemen, no mystery, no missing money.

| Metric | TulongChain |
|---|---|
|  Settlement | Under 5 seconds |
|  Transaction fee | Under $0.01 |
|  Auditability | Every centavo on-chain |
|  Fund security | Locked until emergency declared |

---

## ⚙️ How It Works

```
Donor (Freighter Wallet)
        │
        ▼  donate(donor, token, amount)
┌────────────────────────────────┐
│     TulongChain Soroban        │
│     Contract Escrow            │  ← Funds locked here
│                                │
│  [emergency = false] ──────────┼──► Withdrawals BLOCKED
│  [emergency = true]  ──────────┼──► withdraw(coordinator, amount, purpose)
└────────────────────────────────┘
        │
        ▼  Soroban Events
Stellar Expert · Convex Real-Time Feed
```

### Transaction Flow (demo-able in under 2 minutes)

1. Donor connects **Freighter wallet** → enters USDC amount → clicks **Donate**
2. `donate()` transfers USDC into the contract escrow; a `donated` event is emitted
3. Admin clicks **Declare Emergency** → `declare_emergency()` sets the flag to `true`
4. `withdraw()` sends USDC to the coordinator with a purpose string stored on-chain
5. Dashboard shows live `TotalDonated`, `Balance`, and `TotalWithdrawn` via Convex

---

## 🛰️ Stellar Features Used

| Feature | How It's Used |
|---|---|
| **Soroban Smart Contracts** | Core escrow logic — `donate()`, `declare_emergency()`, `withdraw()`, and `lift_emergency()` all enforced on-chain with no trusted third party |
| **USDC on Stellar** | Stablecoin donations eliminate XLM price volatility — donors and coordinators always know the real-peso equivalent |
| **Trustlines** | Recipients must opt-in to USDC before receiving funds, ensuring SEP-41 compliance |
| **Soroban Events** | `donated`, `emergency_declared`, `emergency_lifted`, `withdrawn` emitted on every state change for public auditability |

---

##  Prerequisites

- [Rust](https://rustup.rs) stable toolchain
- WASM target: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install --locked stellar-cli --features opt`
- [Node.js](https://nodejs.org) v18+
- [Freighter Wallet](https://www.freighter.app) browser extension (set to **Testnet**)

---

##  Getting Started

### 1. Clone & Run Tests

```bash
git clone https://github.com/Debb1ie/Tulong-Chain.git
cd Tulong-Chain/contracts
cargo test
```

Expected output:

```
running 5 tests
test test::test_initialize                ... ok
test test::test_single_donation           ... ok
test test::test_multiple_donors           ... ok
test test::test_emergency_lifecycle       ... ok
test test::test_withdraw_during_emergency ... ok

test result: ok. 5 passed; 0 failed
```

### 2. Build the Contract

```bash
cargo build --target wasm32-unknown-unknown --release
```

### 3. Deploy to Testnet

```bash
# Generate and fund identity (first time only)
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source my-key \
  --network testnet
```

### 4. Initialize the Contract

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- initialize \
  --admin <YOUR_WALLET_ADDRESS>
```

### 5. Run the Frontend

```bash
cd frontend
npm install
cp .env.example .env    # set VITE_CONTRACT_ID
npm run dev
```

---

##  Contract Invocations

**Donate USDC** (500000000 = 50 USDC in stroops)
```bash
stellar contract invoke \
  --id CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO \
  --source my-key \
  --network testnet \
  -- donate \
  --donor <YOUR_ADDRESS> \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 500000000
```

**Declare emergency**
```bash
stellar contract invoke \
  --id CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO \
  --source my-key \
  --network testnet \
  -- declare_emergency
```

**Withdraw funds**
```bash
stellar contract invoke \
  --id CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO \
  --source my-key \
  --network testnet \
  -- withdraw \
  --coordinator <YOUR_ADDRESS> \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 300000000 \
  --purpose "Typhoon relief - Region IV-A"
```

**Lift emergency**
```bash
stellar contract invoke \
  --id CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO \
  --source my-key \
  --network testnet \
  -- lift_emergency
```

**Check balance**
```bash
stellar contract invoke \
  --id CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO \
  --source my-key \
  --network testnet \
  -- get_balance
```

---

##  Tests

| Test | What It Verifies |
|---|---|
| `test_initialize` | Zero balances and emergency flag off at deploy |
| `test_single_donation` | Donor transfer completes and balance updates correctly |
| `test_multiple_donors` | Fund accumulation works across 3 independent donors |
| `test_emergency_lifecycle` | Declare → verify active → lift → verify inactive |
| `test_withdraw_during_emergency` | Two sequential withdrawals produce correct cumulative state |

---

##  Project Structure

```
Tulong-Chain/
├── contracts/
│   ├── src/
│   │   ├── lib.rs       # Smart contract: donate, emergency gate, withdraw
│   │   └── test.rs      # 5 test cases
│   └── Cargo.toml
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   ├── .env             # VITE_CONTRACT_ID=CCHK4RPWA66DAMY4...
│   └── package.json
└── README.md
```

---

##  Target Users

**Donors**
- OFWs (Overseas Filipino Workers) sending relief money home during typhoon season
- Filipino diaspora in the US, Canada, UAE — currently paying Western Union or Remitly fees
- Local NGO members in Luzon, Visayas, and Mindanao who want transparent donation tracking

**Coordinators / Admins**
- Verified barangay relief coordinators managing fund release during active emergencies
- LGU-affiliated organizations that need auditable disbursement records for accountability reports

---

##  MVP Timeline

| Day | Task |
|---|---|
| Day 1 | Set up Rust + Soroban CLI, write and test contract locally |
| Day 2 | Deploy contract to Stellar Testnet, scaffold React/Vite frontend |
| Day 3 | Integrate Freighter wallet + contract invocations in frontend |
| Day 4 | Add Convex real-time feed, polish UI, record demo |
| Day 5 | Submit on Rise In with GitHub + Contract ID |

---

##  Submission

| Field | Value |
|---|---|
| **GitHub Repository** | [github.com/Debb1ie/Tulong-Chain](https://github.com/Debb1ie/Tulong-Chain) |
| **Contract ID** | `CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO` |
| **Stellar Expert** | [View Contract →](https://stellar.expert/explorer/testnet/contract/CCHK4RPWA66DAMY4BAZOTGRCF7Y3RHAODOXZVKFMZ7FNO2ZFEZUMR4CO) |
| **Frontend** | [tulong-chain.vercel.app](https://tulong-chain.vercel.app/) |
| **Convex Dashboard** | [View Real-Time Feed →](https://dashboard.convex.dev/t/deborahgrace0118/frontend-9d9b7/exciting-hawk-153) |
| **Program** | [Rise In — Stellar Philippines UniTour](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan) |

**Short Description:**
> TulongChain is a community disaster relief fund on Stellar. Donors send USDC into a Soroban smart contract escrow that only releases funds when a verified admin declares a disaster emergency — making every centavo traceable and tamper-proof.

### Submission Checklist

- [ ] `cargo test` passes (5 tests)
- [ ] Contract deployed to Stellar Testnet
- [ ] GitHub repository is public
- [ ] Frontend runs on Vercel without errors
- [ ] Convex real-time feed connected
- [ ] Rise In submission form completed

---

##  Resources

| Resource | Link |
|---|---|
| Stellar Docs | https://developers.stellar.org |
| Soroban SDK | https://docs.rs/soroban-sdk |
| Stellar CLI Docs | https://developers.stellar.org/docs/tools/stellar-cli |
| Freighter Wallet | https://freighter.app |
| Stellar Expert (Testnet) | https://stellar.expert/explorer/testnet |
| Deploy Guide | https://github.com/armlynobinguar/Stellar-Bootcamp-2026 |
| Community Treasury Example | https://github.com/armlynobinguar/community-treasury |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for Filipino families 🇵🇭 · Stellar Philippines UniTour Bootcamp 2026*
