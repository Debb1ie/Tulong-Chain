# TulongChain

> **Community disaster relief fund for Filipino families — transparent, instant, on-chain.**  
> Built on Stellar + Soroban · Stellar Philippines UniTour Bootcamp 2026

![Stellar](https://img.shields.io/badge/Stellar-Soroban-7F77DD?style=flat-square&logo=stellar&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-1.78-D85A30?style=flat-square&logo=rust&logoColor=white)
![USDC](https://img.shields.io/badge/Token-USDC-2775CA?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-888780?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-5%20passing-639922?style=flat-square)
![Network](https://img.shields.io/badge/Network-Testnet-BA7517?style=flat-square)

---

## The Problem

Natural disasters hit the Philippines **every typhoon season**. Relief fundraising is scattered across GCash, bank transfers, and social media group chats.

| Pain Point | Current State |
|---|---|
| Settlement time | 3–5 business days |
| Transfer fees | 5–10% per donation |
| Transparency | Screenshot-based trust |
| Emergency speed | Coordinator waits for bank clearance |

Typhoon victims wait **days** for food and medicine while coordinators lose a cut of every peso to fees and tracking errors.

---

## The Solution

TulongChain lets anyone donate USDC directly into a **Soroban smart contract escrow**. Funds stay locked on-chain until a verified coordinator declares a disaster emergency. Every donation and withdrawal is publicly traceable on Stellar Expert — no middlemen, no mystery.

| Metric | TulongChain |
|---|---|
| ⚡ Settlement | **Under 5 seconds** |
| 💸 Transaction fee | **Under $0.01** |
| 🔍 Auditability | **Every peso on-chain** |
| 🔒 Fund security | **Locked until emergency declared** |

---

## Transaction Flow

```
Freighter Wallet → donate() → Escrow Locked → declare_emergency() → withdraw() → Coordinator Wallet
```

Every state change emits a **Soroban event** → visible on Stellar Expert and mirrored live via Convex.

---

## Stellar Features Used

| Feature | How It's Used |
|---|---|
| **Soroban Smart Contracts** | Core escrow logic — `donate()`, `declare_emergency()`, `withdraw()`, `lift_emergency()` all enforced on-chain |
| **USDC on Stellar** | Stablecoin donations eliminate XLM price volatility — donor amounts are predictable and stable |
| **Trustlines** | Recipients must opt-in to USDC before receiving funds, ensuring SEP-41 compliance |
| **Soroban Events** | `donated`, `emergency_declared`, `emergency_lifted`, `withdrawn` — emitted on every state change |

---

## Target Users

**Donors**
- OFWs (Overseas Filipino Workers) sending relief money home during typhoon season
- Filipino diaspora in the US, Canada, UAE — currently using Western Union or Remitly
- Local NGO members in Luzon, Visayas, Mindanao who want transparent donation tracking

**Coordinators / Admins**
- Verified barangay relief coordinators managing fund release during active emergencies
- LGU-affiliated organizations that need auditable disbursement records

> Donors want to know their money arrived and was spent correctly — not just trust a screenshot. Coordinators want to move fast during emergencies without waiting for bank clearance windows.

---

## Prerequisites

- [Rust](https://rustup.rs) (stable toolchain)
- WASM build target: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install --locked stellar-cli --features opt`
- [Node.js](https://nodejs.org) v18+
- [Freighter Wallet](https://www.freighter.app) browser extension (set to Testnet)

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/tulongchain.git
cd tulongchain/contracts

# 2. Run tests
cargo test

# 3. Build WASM
cargo build --target wasm32-unknown-unknown --release

# 4. Generate testnet identity
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet

# 5. Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source my-key \
  --network testnet

# 6. Initialize with your admin wallet address
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- initialize \
  --admin <YOUR_WALLET_ADDRESS>
```

---

## Contract Invocations

**Donate USDC**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- donate \
  --donor GABC123...XYZ \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 500000000
```

**Declare emergency**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- declare_emergency
```

**Withdraw funds**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- withdraw \
  --coordinator GABC123...XYZ \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 300000000 \
  --purpose "Typhoon relief - Region IV-A"
```

**Check balance**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- get_balance
```

---

## Test Results

```
running 5 tests
test test::test_initialize               ... ok
test test::test_single_donation          ... ok
test test::test_multiple_donors          ... ok
test test::test_emergency_lifecycle      ... ok
test test::test_withdraw_during_emergency ... ok

test result: ok. 5 passed; 0 failed; 0 ignored
```

| Test | Covers |
|---|---|
| `test_initialize` | Zero balances, no emergency on deploy |
| `test_single_donation` | Donor transfer + balance update |
| `test_multiple_donors` | Fund accumulation across 3 donors |
| `test_emergency_lifecycle` | Declare → verify → lift → verify |
| `test_withdraw_during_emergency` | Two sequential withdrawals, correct balance state |

---

## MVP Timeline

| Day | Task |
|---|---|
| Day 1 | Set up Rust + Soroban CLI, write and test contract locally |
| Day 2 | Deploy contract to Stellar Testnet, scaffold React frontend |
| Day 3 | Integrate Freighter wallet + contract invocations in frontend |
| Day 4 | Add Convex real-time feed, polish UI, record demo |
| Day 5 | Submit on Rise In with GitHub + Contract ID |

---

## Architecture

```
┌────────────────────────────────────────────────┐
│                  Frontend (React)               │
│     Freighter Wallet · Stellar SDK · Convex     │
└──────────────────────┬─────────────────────────┘
                       │  invoke
┌──────────────────────▼─────────────────────────┐
│           TulongChain Soroban Contract          │
│                                                 │
│  donate()  declare_emergency()  lift_emergency()│
│  withdraw()                                     │
│                                                 │
│  Storage: Admin · Donations · Withdrawals       │
│           TotalDonated · TotalWithdrawn         │
│           Emergency (bool)                      │
└──────────────────────┬─────────────────────────┘
                       │  events
┌──────────────────────▼─────────────────────────┐
│      Stellar Expert · Convex Real-Time DB       │
└────────────────────────────────────────────────┘
```

---

## Submission Checklist

- [ ] `cargo test` passes with 5+ tests
- [ ] Contract deployed to Stellar Testnet
- [ ] Contract ID saved (starts with `C...`)
- [ ] GitHub repository is public
- [ ] Frontend runs locally without errors
- [ ] Rise In submission form completed

**Submit here:** https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan

| Field | What to Enter |
|---|---|
| GitHub Repository | `https://github.com/<your-username>/tulongchain` |
| Contract ID | `<YOUR_CONTRACT_ID>` |
| Stellar Expert Link | `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>` |
| Short Description | TulongChain is a community disaster relief fund on Stellar. Donors send USDC into a Soroban smart contract escrow that only releases funds when a verified admin declares a disaster emergency — making every centavo traceable and tamper-proof. |

---

## Resources

| Resource | Link |
|---|---|
| Stellar Docs | https://developers.stellar.org |
| Soroban SDK | https://docs.rs/soroban-sdk |
| Stellar CLI | https://developers.stellar.org/docs/tools/stellar-cli |
| Freighter Wallet | https://freighter.app |
| Stellar Expert (Testnet) | https://stellar.expert/explorer/testnet |
| Deploy Guide | https://github.com/armlynobinguar/Stellar-Bootcamp-2026 |
| Example Full-Stack | https://github.com/armlynobinguar/community-treasury |
| Rise In Program | https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for Filipino families 🇵🇭 · Stellar Philippines UniTour Bootcamp 2026*
