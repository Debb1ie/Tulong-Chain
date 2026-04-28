# TulongChain

**Community disaster relief fund for Filipino families — transparent, instant, on-chain, with advanced safety controls.**

Built on **Stellar + Soroban** · Stellar Philippines UniTour Bootcamp 2026

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-7F77DD?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-534AB7?style=flat-square)](https://soroban.stellar.org)
[![Rust](https://img.shields.io/badge/Language-Rust-D85A30?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![USDC](https://img.shields.io/badge/Token-USDC-2775CA?style=flat-square)](https://www.circle.com/usdc)
[![Contract CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml/badge.svg)](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml)
[![Frontend CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/frontend.yml/badge.svg)](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/frontend.yml)

---

## Live Links

| Resource | Link |
|---|---|
| **Frontend (Vercel)** | [tulong-chain.vercel.app](https://tulong-chain.vercel.app/) |
| **GitHub Repository** | [github.com/Debb1ie/Tulong-Chain](https://github.com/Debb1ie/Tulong-Chain) |
| **Convex Dashboard** | [dashboard.convex.dev/t/deborahgrace0118/frontend-9d9b7/exciting-hawk-153](https://dashboard.convex.dev/t/deborahgrace0118/frontend-9d9b7/exciting-hawk-153) |
| **Stellar Expert (Testnet)** | [View Contract →](https://stellar.expert/explorer/testnet/contract/CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC) |

### Deployed Contract (Stellar Testnet)

```
CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC
```

*Deployment transaction:* [5270fa4b921320c561f37007e3d9c48b9759db6366412a4dab25440658d0962a](https://stellar.expert/explorer/testnet/tx/5270fa4b921320c561f37007e3d9c48b9759db6366412a4dab25440658d0962a)  
*Initialize transaction:* [6eb7533a803a1531279c04a9111c1b727235274ff2b06585403cb0685ec57132](https://stellar.expert/explorer/testnet/tx/6eb7533a803a1531279c04a9111c1b727235274ff2b06585403cb0685ec57132)

---

## The Problem

Natural disasters hit the Philippines every typhoon season — yet relief fundraising still runs through GCash group chats, manual bank transfers, and screenshots shared on Facebook. 

| Pain Point | Reality |
|---|---|
| Settlement time | 3–5 business days |
| Transfer fees | 5–10% per donation lost |
| Transparency | Screenshot-based trust |
| Emergency speed | Coordinators wait for bank clearance windows |

Typhoon victims wait **days** for food and medicine while coordinators lose a cut of every peso to fees, exchange spreads, and manual tracking errors.

---

## The Solution

**TulongChain** lets anyone donate USDC directly into a **Soroban smart contract escrow**. Funds stay locked on-chain until a verified admin declares a disaster emergency. Every donation and withdrawal is permanently traceable on Stellar Expert — no middlemen, no mystery, no missing money.

**Advanced safety features** (production-grade):
- **Pausable** – Admin can halt all operations in case of bug or attack
- **Emergency Timelock** – Declared emergencies require a configurable delay (default 0 = instant, can be set to ≥1 h) before withdrawals activate
- **Batch Donations** – Donors can batch multiple token transfers atomically (up to 50 per call)
- **Batch Withdrawals** – Coordinators can release funds for multiple relief purposes in a single transaction (up to 20 per call)
- **Immutable History** – Full on-chain audit trail of donations and withdrawals

| Metric | TulongChain |
|---|---|
|  Settlement | Under 5 seconds |
|  Transaction fee | Under $0.01 |
|  Auditability | Every centavo on-chain |
|  Fund security | Locked until emergency declared |
|  Emergency safety | Timelock prevents rushed withdrawals |

---

## How It Works

```
Donor (Freighter Wallet)
        │
        ▼  donate(donor, token, amount) / batch_donate(...)
┌────────────────────────────────┐
│     TulongChain Soroban        │
│     Contract Escrow            │  ← Funds locked here
│                                │
│  [paused = false] ─────────────┼──► Operations allowed
│  [emergency = false] ──────────┼──► Withdrawals BLOCKED
│  [emergency = true] ───────────┼──► withdraw(...) / batch_withdraw(...)
└────────────────────────────────┘
        │
        ▼  Soroban Events
Stellar Expert · Convex Real-Time Feed
```

### Advanced Emergency Lifecycle

1. **Admin declares** emergency → starts timelock countdown
2. If timelock > 0, funds remain locked until countdown expires
3. Admin may `activate_emergency` once countdown ends
4. Withdrawals become possible until `lift_emergency`

---

## Stellar Features Used

| Feature | How It's Used |
|---|---|
| **Soroban Smart Contracts** | Core escrow logic — `donate`, `batch_donate`, `pause`, `declare → timelock → activate`, `batch_withdraw` — on-chain enforcement |
| **USDC Stablecoin** | Stable donations immune to XLM price swings |
| **Inter-contract Calls** | `token::Client` calls to transfer any SEP-41 token (USDC, XLM, or future tokens) |
| **Soroban Events** | `donated`, `emergency_declared`, `emergency_activated`, `batch_donated`, `paused`, `unpaused`, `withdrawn`, `batch_withdrawn` for public auditability |
| **Testnet** | Fully operational on Stellar Testnet — try with test tokens |

---

## Prerequisites

- [Rust](https://rustup.rs) stable toolchain
- WASM target: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install --locked stellar-cli --features opt`
- [Node.js](https://nodejs.org) v18+
- [Freighter Wallet](https://freighter.app) browser extension (set to **Testnet**)

---

## Getting Started

### 1. Clone & Run Tests (Smart Contract)

```bash
git clone https://github.com/Debb1ie/Tulong-Chain.git
cd Tulong-Chain/contracts
cargo test --release
```

**Expect output:**

```
running 21 tests
test test::test_initialize ... ok
test test::test_donate ... ok
test test::test_batch_donate ... ok
test test::test_withdraw ... ok
test test::test_batch_withdraw ... ok
test test::test_timelock_with_delay ... ok
test test::test_pause_unpause ... ok
test test::test_advanced_complex_flow ... ok
...
test result: ok. 21 passed; 0 failed; 0 ignored; 0 measured
```

### 2. Build the Contract

```bash
cargo build --target wasm32-unknown-unknown --release
```

WASM binary: `target/wasm32-unknown-unknown/release/tulong_chain.wasm`

### 3. Deploy to Testnet

```bash
# Create / use an identity (my-key)
stellar keys generate my-key

# Fund if needed via friendbot or transfer from another account
curl "https://friendbot.stellar.org?account=$(stellar keys address my-key)"

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source my-key \
  --network testnet
```

Take note of the **Contract ID** returned.

### 4. Initialize the Contract

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS>
```

After this, the contract is live and ready for donations.

### 5. Run the Frontend

```bash
cd frontend
npm install
cp .env.example .env    # edit .env to set VITE_CONTRACT_ID if different
npm run dev
```

Open browser at `http://localhost:5173` (connect Freighter on Testnet).

---

## Contract Invocation Examples

**Donate USDC** (50000000 = 0.5 USDC)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- donate \
  --donor <YOUR_ADDRESS> \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 50000000000
```

**Declare Emergency** (instant if timelock = 0)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- declare_emergency
```

**Set Timelock** (e.g., 1 hour = 3600 seconds)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- set_timelock \
  --seconds 3600
```

**Pause Contract** (emergency stop)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- pause
```

**Batch Donate** (multiple entries in one call)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- batch_donate \
  --batches '[{"token":"CBIEL...","amount":100000000,"asset":0},{"token":"CBIEL...","amount":200000000,"asset":0}]'
```

**Batch Withdraw** (multiple relief purposes)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- batch_withdraw \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --batches '[{"purpose":"Food packs","amount":150000000},{"purpose":"Water","amount":50000000}]'
```

---

## Tests

| Test | What It Verifies |
|---|---|
| `test_initialize` | Admin set, zero balances, not paused |
| `test_donate` | Single donation transfers and records |
| `test_batch_donate` | Atomic multiple donations (3 items) |
| `test_multiple_donors` | Accumulation across donors |
| `test_emergency_instant` | Immediate declare (timelock 0) |
| `test_timelock_with_delay` | 1-hour timelock, activation after countdown |
| `test_withdraw` | Single withdrawal reduces balance |
| `test_batch_withdraw` | Multiple withdrawal purposes atomically |
| `test_pause_unpause` | Admin can halt/resume operations |
| `test_over_withdraw` | Overdraft protection (panic) |
| `test_zero_donation` | Zero-amount rejection |
| `test_history` | Full donation history accurate |
| `test_advanced_complex_flow` | Integrated: deposit → set timelock → declare → activate → batch withdraw |

All 21 unit tests pass on release build.

---

## Project Structure

```
Tulong-Chain/
├── contracts/              # Soroban smart contract (Rust)
│   ├── Cargo.toml
│   ├── src/
│   │   ├── lib.rs         # Main contract (donate, pause, timelock, batch, views)
│   │   └── test.rs        # 21 comprehensive test cases
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── lib/
│   │   │   ├── stellar.ts # Contract API (incl. advanced features)
│   │   │   └── freighter.ts
│   │   ├── views/
│   │   │   ├── HomePage.tsx
│   │   │   └── DashboardPage.tsx   ← now shows paused, timelock, admin tools
│   │   ├── components/
│   │   │   ├── DonateForm.tsx
│   │   │   ├── WithdrawForm.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── TransactionHistory.tsx
│   │   └── styles/global.css  ← added .paused-banner, .timelock-banner, .admin-controls
│   ├── .env.example
│   └── package.json
├── convex/                 # Backend mirror (real-time feed)
├── .github/
│   └── workflows/
│       ├── contracts.yml    # CI: cargo test + build WASM
│       └── frontend.yml     # CI: npm ci, tsc, build
├── README.md
└── LICENSE
```

---

## Advanced Implementation Details

### Pausable Pattern
- Admin can instantly stop all donations and withdrawals via `pause()` / `unpause()`.
- In `donate`, `batch_donate`, `withdraw`, `batch_withdraw`: `assert!(!is_paused)`.

### Timelock Emergency
- Global `timelock_seconds` storage (default 0 = instant). Admin can update with `set_timelock(seconds)` (min 3600).
- `declare_emergency()` stores declaration with `activates_at = now + timelock`.
- `is_emergency()` returns false until `now >= activates_at`.
- `activate_emergency()` can be called once timelock expires to set flag true.
- `lift_emergency()` cancels pending timelock.

### Batch Operations
- `batch_donate(Vec<(token, amount, asset)>)` atomic group donation.
- `batch_withdraw(Vec<(purpose, amount)>)` atomic multi-purpose withdrawal.
- Both respect all guard checks (paused, emergency, balance) and publish aggregate events.

### Inter-Contract Calls
- Uses `token::Client` to call `transfer` on any SEP-41 token contract.
- No hardcoded asset types; accepts any token address.

---

## Configuration

**Frontend env (`.env`):**

```
VITE_CONTRACT_ID=CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC
VITE_USDC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
VITE_NETWORK=testnet
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_CONVEX_URL=<your-convex-deployment>
```

---

## Screenshots

**Mobile Responsive View**  
![Mobile view](docs/images/mobile-screenshot.png)  
*(Responsive dashboard on iPhone 12 — donate form, stats, activity feed scale gracefully)*

**CI/CD Pipeline**  
![CI Badge](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml/badge.svg)  
([Contract CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml))  
([Frontend CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/frontend.yml))

---

## Future Enhancements

- Full UI for batch donations/withdrawals
- Custom **TULONG** native token deployment
- Multi-sig admin for emergency declaration
- Time-locked treasury upgrades (proxy pattern)
- Token whitelist for allowed assets

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for Filipino families 🇵🇭 · Stellar Philippines UniTour Bootcamp 2026 · Advanced Soroban patterns*