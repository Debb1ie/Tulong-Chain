# TulongChain Architecture

## System Overview

TulongChain is a decentralized disaster relief fund built on **Stellar** and **Soroban** smart contracts. It enables transparent, instant, and low-cost donations in USDC (or XLM) that are held in escrow until an emergency is declared by trusted administrators.

**Design Goals:**
- **Transparency**: Every donation and withdrawal is permanently recorded on-chain
- **Speed**: Settlement in under 5 seconds
- **Low Cost**: Transaction fees under $0.01
- **Safety**: Emergency timelock and pausable mechanisms
- **Simplicity**: Direct wallet-to-contract interaction, no intermediary platform

---

## High-Level Architecture

```
┌────────────────┐
│  Donor (Web)   │ Freighter Wallet
└────────┬───────┘
         │ 1. donate() call
         ▼
┌───────────────────────────────────────────┐
│   Stellar Testnet / Soroban Environment   │
│  ┌─────────────────────────────────────┐  │
│  │  TulongChain Soroban Smart Contract │  │ ← Core escrow logic
│  │  - State: balance, emergency flag   │  │
│  │  - Functions: donate, withdraw, etc │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │  USDC Token Contract (SEP-41)       │  │ ← Stablecoin
│  └─────────────────────────────────────┘  │
└─────────────┬─────────────────────────────┘
              │ 2. Events (donated, withdrawn)
              ▼
   ┌────────────────────┐
   │ Stellar Expert     │ ← Public explorer
   │ Convex Feed (opt)  │ ← Real-time monitoring
   └────────────────────┘
         │
         ▼
   ┌────────────────────┐
   │ Frontend Dashboard │ ← React + Vite
   │ - Read contract    │
   │ - Sign tx via      │
   │   Freighter        │
   └────────────────────┘
```

---

## Smart Contract Architecture

### Contract Location
- **Network**: Stellar Testnet
- **Contract ID**: `CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC`
- **Language**: Rust (Soroban SDK)
- **WASM Binary**: `contracts/target/wasm32-unknown-unknown/release/tulong_chain.wasm`

### Storage Layout

| Key | Type | Description |
|-----|------|-------------|
| `admin` | `Address` | Admin address (set at initialize) |
| `balance` | `i128` | Total USDC in escrow (in 7-decimal units) |
| `total_donated` | `i128` | Cumulative donated amount |
| `total_withdrawn` | `i128` | Cumulative withdrawn amount |
| `is_emergency` | `bool` | Emergency state (true = withdrawals allowed) |
| `timelock_seconds` | `u64` | Delay before emergency activation (0 = instant) |
| `emergency_declared_at` | `u64` | Timestamp of emergency declaration |
| `is_paused` | `bool` | Pausable flag (halt all operations) |
| `donation_history` | `Vec<(Address, i128, u64)>` | Immutable log of donations |
| `withdrawal_history` | `Vec<(Address, i128, String, u64)>` | Immutable log of withdrawals |

### Core Functions

#### Donation Functions
```rust
pub fn donate(
    donor: Address,
    token: Address,
    amount: i128
) // Transfers tokens from donor to contract
```

```rust
pub fn batch_donate(
    batches: Vec<(Address, i128, u32)>  // (token, amount, asset)
) // Atomic batch donation (max 50 per call)
```

#### Emergency Lifecycle
```rust
pub fn declare_emergency() // Starts timelock countdown
pub fn activate_emergency() // Enables withdrawals after timelock
pub fn lift_emergency() // Returns to locked state
```

Timeline:
1. Admin calls `declare_emergency()` → `emergency_declared_at` set
2. If `timelock_seconds > 0`, funds remain locked until `now >= declared_at + timelock`
3. Admin calls `activate_emergency()` → `is_emergency = true`, withdrawals enabled
4. Admin calls `lift_emergency()` → `is_emergency = false`

#### Withdrawal Functions
```rust
pub fn withdraw(
    coordinator: Address,
    token: Address,
    amount: i128,
    purpose: String
) // Releases funds to coordinator (requires active emergency)
```

```rust
pub fn batch_withdraw(
    token: Address,
    batches: Vec<(String, i128)>  // (purpose, amount)
) // Atomic batch withdrawal (max 20 per call)
```

#### Admin Controls
```rust
pub fn pause() // Halt all operations
pub fn unpause() // Resume operations
pub fn set_timelock(seconds: u64) // Update global timelock (min 1h)
```

#### View Functions (Read-Only)
```rust
pub fn get_balance() -> i128
pub fn get_total_donated() -> i128
pub fn get_total_withdrawn() -> i128
pub fn is_emergency() -> bool
pub fn is_paused() -> bool
pub fn get_timelock_duration() -> u64
pub fn get_emergency_timelock() -> (u64, u64) // (declared_at, activates_at)
pub fn get_donation_history() -> Vec<(Address, i128, u64)>
pub fn get_withdrawal_history() -> Vec<(Address, i128, String, u64)>
```

---

## Frontend Architecture

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Vanilla CSS (Nunito + JetBrains Mono fonts)
- **State Management**: React hooks + Convex real-time queries
- **Wallet Integration**: Freighter API (Stellar wallet)
- **Contract SDK**: `@stellar/stellar-sdk` + Soroban RPC

### Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── DonateForm.tsx    # Simple donation instructions
│   │   ├── StatsCard.tsx     # Metric display
│   │   ├── TransactionHistory.tsx # Donation/withdrawal list
│   │   ├── ActivityFeed.tsx  # Contract event feed
│   │   └── FeedbackModal.tsx # User onboarding survey
│   ├── lib/
│   │   ├── stellar.ts        # Contract API wrapper (cache + invoke)
│   │   ├── freighter.ts      # Wallet connection & signing
│   │   ├── config.ts         # Contract IDs & network settings
│   │   └── feedback.ts       # Feedback persistence & export
│   ├── views/
│   │   ├── HomePage.tsx      # Landing + marketing
│   │   └── DashboardPage.tsx # Main app + admin tools
│   ├── styles/
│   │   └── global.css        # Design system (B&Y theme)
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

### Key Frontend Patterns

#### Contract Interaction Pattern
All contract calls follow a two-tier pattern:
1. **Read-only** (`readContract`) — Cached for 5 seconds, no signing
2. **Write** (`invokeContract`) — Simulate → sign → submit → poll for result

#### Wallet State
```typescript
interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
}
```
Managed globally and passed as props to views.

#### Network Enforcement
Freighter must be on **Stellar Testnet**. The app checks at mount and shows a banner if wrong network detected (via `freighter.getNetwork()`).

---

## Data Flow

### Donation Flow
1. User connects Freighter → wallet address stored in state
2. User reads contract address from dashboard
3. User sends XLM/USDC via Freighter (external to app)
4. Frontend polls Horizon `/accounts/{contract}` every 15s or listens to Convex events
5. Balance update reflected in stats in real-time

### Emergency Declaration Flow
1. Admin clicks "Declare Emergency" in admin panel
2. Frontend calls `declare_emergency()` (signed tx)
3. Transaction confirmed on-chain
4. If timelock > 0, banner shows activation countdown
5. Admin calls `activate_emergency()` after timelock expires
6. Withdrawals enabled; banner updates to "EMERGENCY ACTIVE"

### Feedback Collection Flow
1. On first visit to Dashboard, `showFeedbackModal` delayed by 2s
2. Modal captures: wallet (auto), name, email, rating, feedback text
3. Submitted data stored in `localStorage` under `tulong_feedback_all`
4. One-time submission tracked via `tulong_feedback_submitted_{wallet}`
5. CSV export available via browser console or admin utility

---

## Security Considerations

| Threat | Mitigation |
|--------|------------|
| Unauthorized emergency declaration | Only `admin` address can call `declare_emergency()` (on-chain check) |
| Over-withdrawal | Contract asserts `amount <= balance` before any transfer |
| Paused state misuse | All operations guarded by `assert!(!is_paused)` |
| Timelock bypass | `activate_emergency()` only callable after `declared_at + timelock` |
| Reentrancy | Soroban's linear memory model prevents reentrancy by design |
| Phishing | Admin controls require Freighter signing; no API keys stored |

**Production hardening needed**:
- Multi-sig admin for emergency declaration (currently single admin)
- Withdrawal caps per period
- Whitelist approved recipient organizations
- Rate-limit donation events

---

## Convex Backend (Optional)

The project references a Convex deployment for real-time event feeds:
- **Schema**: `fund/activity` table indexed by timestamp
- **Subscription**: `useQuery(api.fund.getActivityFeed)` in Dashboard
- **Sync**: Stellar Expert webhooks → Convex → React

Convex is not required for core functionality; the frontend works with Horizon polling fallback.

---

## CI/CD

### GitHub Actions

**Contracts** (`.github/workflows/contracts.yml`):
- `cargo check` + `cargo test --release`
- Build WASM artifact
- Upload testnet deployment transaction (manual)

**Frontend** (`.github/workflows/frontend.yml`):
- `npm ci`
- `npm run build` (TypeScript + Vite)
- Deploy to Vercel on push to `main`

### Test Coverage

21 unit tests in `contracts/src/test.rs` covering:
- Single & batch donations
- Emergency lifecycle with/without timelock
- Withdrawal authorization checks
- Pausable guard
- History integrity
- Complex multi-step flow

---

## Deployment

### Smart Contract

```bash
# Build
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Deploy
stellar keys generate deploy-key
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source deploy-key \
  --network testnet

# Initialize
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source deploy-key \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS>
```

### Frontend

**Manual**:
```bash
cd frontend
npm install
cp .env.example .env  # edit CONTRACT_ID if needed
npm run build
npx vercel --prod
```

**GitHub Actions**: Push to `main` triggers automatic Vercel deployment.

---

## External Dependencies

| Service | Purpose | Fallback |
|---------|---------|----------|
| Freighter Browser Extension | Wallet connection & transaction signing | None (required) |
| Soroban Testnet RPC | Simulate & submit contract calls | Stellar maintains multiple endpoints |
| Horizon Testnet | Read account balances | Direct RPC alternatives |
| Stellar Expert | Block explorer verification | Soroban RPC `getTransaction` |

---

## Limitations & Future Work

See [README.md](../README.md#future-enhancements) for planned features:
- Batch donations UI
- Native TULONG token
- Multi-sig emergency
- Token whitelist
- Mobile-responsive donation form (currently copy-paste address)
