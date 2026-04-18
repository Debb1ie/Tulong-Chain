# 🎓 StellaroidEarn

**On-chain credential verification and learn-to-earn rewards for Filipino students — powered by Stellar + Soroban.**

Built on **Stellar + Soroban** · Stellar Philippines UniTour Bootcamp 2026

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-7F77DD?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-534AB7?style=flat-square)](https://soroban.stellar.org)
[![Rust](https://img.shields.io/badge/Language-Rust-D85A30?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![XLM](https://img.shields.io/badge/Token-XLM%20%2F%20USDC-2775CA?style=flat-square)](https://stellar.org)
[![Tests](https://img.shields.io/badge/Tests-3%20passing-639922?style=flat-square)](#tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-888780?style=flat-square)](LICENSE)

---

## 🌐 Live Contract

**Deployed on Stellar Testnet**

```
<YOUR_CONTRACT_ID>
```

🔍 **[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>)**

---

## The Problem

A graduating student at the University of the Philippines or a bootcamp completer at Zuitt cannot easily prove their credentials to employers. Manual verification takes days or weeks — HR teams email institutions, institutions respond slowly, and fraudulent certificates circulate freely in GDrive links and printed PDFs.

| Pain Point | Reality |
|---|---|
| Credential verification | 3–10 days via email / manual processes |
| Certificate fraud | Fabricated PDFs undetectable without contacting the issuer |
| Payment routing | Students share wrong GCash numbers or bank accounts |
| Financial access | Fresh graduates cannot access DeFi, loans, or on-chain payroll |

Students lose job opportunities and income while employers waste time on verification backlogs they cannot trust.

---

## The Solution

StellaroidEarn registers every certificate as an immutable on-chain record anchored to the student's Stellar wallet. Institutions issue once; anyone — employers, DAOs, lending protocols — verifies instantly. Students earn XLM rewards upon certificate issuance. Employers pay directly to the on-chain verified wallet address, eliminating misdirected payments.

| Metric | StellaroidEarn |
|---|---|
|  Verification speed | Under 5 seconds |
|  Transaction fee | Under $0.01 |
|  Tamper detection | Hash mismatch = fraud flagged on-chain |
|  Payment safety | Employer pays to contract-verified wallet only |
|  Learn-to-earn | XLM reward on every verified certificate |

---

## How It Works

```
University / Bootcamp (Admin)
         │
         ▼ register_certificate(owner, hash, title, issuer)
 ┌────────────────────────────────────────┐
 │       StellaroidEarn Soroban           │
 │       Contract Registry               │
 │                                        │
 │  CertRecord {                          │
 │    hash:      SHA-256 of document      │
 │    owner:     Student Stellar wallet   │
 │    title:     "BSc Computer Science"   │
 │    issuer:    "UP Diliman"             │
 │    issued_at: Ledger timestamp         │
 │    rewarded:  false → true             │
 │  }                                     │
 └─────────┬──────────────────────────────┘
           │
           ├──► reward_student(hash)
           │         └── XLM → student wallet
           │
           ├──► verify_certificate(hash, claimed_owner)
           │         └── returns bool + emits cert_verified event
           │
           └──► link_payment(employer, hash, token, amount)
                      └── employer funds → student verified wallet
```

**Transaction flow (demo-able in under 2 minutes):**

1. Institution connects Freighter (admin wallet) → calls `register_certificate()`
2. Certificate hash + student wallet stored permanently on-chain; `cert_registered` event emitted
3. Admin calls `reward_student()` → XLM transferred from contract to student wallet; `student_rewarded` event emitted
4. Employer calls `verify_certificate(hash, student_address)` → returns `true` in <5 seconds
5. Employer calls `link_payment()` → funds go directly to the verified wallet address; `payment_linked` event emitted
6. Dashboard shows all events in real time via Stellar Expert

---

## Stellar Features Used

| Feature | How It's Used |
|---|---|
| **Soroban Smart Contracts** | Core registry — `register_certificate()`, `reward_student()`, `verify_certificate()`, `link_payment()` all enforced on-chain |
| **XLM Transfers** | Learn-to-earn: XLM reward paid to student wallet on certificate issuance |
| **Custom Tokens** | Optional: schools can issue a credential asset (e.g. `UPDCERT`) as a Stellar custom token |
| **Trustlines** | Students must hold a trustline to receive school-issued credential tokens |
| **Soroban Events** | `cert_registered`, `student_rewarded`, `cert_verified`, `payment_linked` — emitted on every state change |

---

## Contract Functions

| Function | Caller | Description |
|---|---|---|
| `initialize()` | Admin (deploy) | Set admin wallet, reward token, reward amount |
| `register_certificate()` | Admin only | Hash + wallet on-chain; duplicate + tamper guard |
| `reward_student()` | Admin only | Transfer XLM reward to student; idempotency guard |
| `verify_certificate()` | Anyone | Returns bool; emits `cert_verified` event |
| `link_payment()` | Employer | Transfer funds to verified student wallet |
| `get_certificate()` | Anyone | Read full `CertRecord` by hash |
| `get_total_certificates()` | Anyone | Count of all registered certs |
| `get_reward_amount()` | Anyone | Current XLM reward per certificate |

---

## Prerequisites

- [Rust](https://rustup.rs) stable toolchain
- WASM target: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install --locked stellar-cli --features opt`
- [Node.js](https://nodejs.org) v18+
- [Freighter Wallet](https://www.freighter.app) browser extension (set to Testnet)

---

## Getting Started

### 1. Clone & Test

```bash
git clone https://github.com/<your-username>/stellaroid-earn.git
cd stellaroid-earn/contracts
cargo test
```

Expected output:

```
running 3 tests
test test::test_register_and_reward_student   ... ok
test test::test_duplicate_certificate_rejected ... ok
test test::test_certificate_storage_state     ... ok

test result: ok. 3 passed; 0 failed
```

### 2. Build

```bash
cargo build --target wasm32-unknown-unknown --release
```

Output WASM: `target/wasm32-unknown-unknown/release/stellaroid_earn.wasm`

### 3. Deploy to Testnet

```bash
# Generate identity (first time only)
stellar keys generate --global my-key --network testnet
stellar keys fund my-key --network testnet

# Deploy contract
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellaroid_earn.wasm \
  --source my-key \
  --network testnet
```

Copy the Contract ID (starts with `C...`) from the output.

### 4. Initialize

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- initialize \
  --admin <ADMIN_WALLET_ADDRESS> \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --reward_amount 100000000
```

> `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` is the XLM (native) token contract on Testnet. `100000000` = 10 XLM (7-decimal precision).

---

## Contract Invocations

**Register a certificate**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- register_certificate \
  --owner GABC123...XYZ \
  --hash aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899 \
  --title "Bachelor of Science in Computer Science" \
  --issuer "University of the Philippines Diliman"
```

**Reward a student**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- reward_student \
  --hash aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899
```

**Verify a certificate**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- verify_certificate \
  --hash aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899 \
  --claimed_owner GABC123...XYZ
```

**Employer payment**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source employer-key \
  --network testnet \
  -- link_payment \
  --employer GEMPLOYER123...XYZ \
  --hash aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899 \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amount 500000000
```

**Check a stored certificate**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- get_certificate \
  --hash aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899
```

---

## Tests

| Test | Type | Coverage |
|---|---|---|
| `test_register_and_reward_student` | Happy path | Register cert → verify → reward → assert balance delta |
| `test_duplicate_certificate_rejected` | Edge case | Same hash submitted twice → `DuplicateCertificate` error returned |
| `test_certificate_storage_state` | State verification | Stored record fields match inputs; verify true/false for correct/wrong owner |

---

## Project Structure

```
stellaroid-earn/
├── contracts/
│   ├── src/
│   │   ├── lib.rs        # Smart contract: registry, reward, verify, pay
│   │   └── test.rs       # 3 test cases
│   └── Cargo.toml
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── CertForm.tsx
│   │       ├── VerifyPanel.tsx
│   │       └── RewardDashboard.tsx
│   └── .env              # VITE_CONTRACT_ID=<YOUR_CONTRACT_ID>
└── README.md
```

---

## Target Users

**Students / Graduates**
- Fresh graduates at Philippine universities (UP, DLSU, Ateneo, UST)
- Bootcamp completers at Zuitt, Kodego, and similar coding schools
- OFWs with foreign credentials seeking Philippine employer verification

**Institutions / Issuers**
- University registrars issuing diplomas and transcript-backed credentials
- Bootcamps issuing completion certificates with skills metadata
- DAOs issuing contributor credentials and proof-of-work NFTs

**Employers**
- Philippine tech companies verifying developer skills before onboarding
- Remote-first companies hiring across SEA who need instant credential checks
- DeFi protocols gating financial products behind verified credential ownership

---

## Vision

StellaroidEarn is not just a certificate registry — it is the on-chain identity layer for the Philippine gig and formal economy. Once a student's credentials are on-chain, they become composable primitives: collateral for micro-loans, gates for DAO membership, proof of work for payroll automation, and unlock conditions for DeFi yield products. Every certificate issued is a step toward a fully verifiable, financially sovereign student identity.

---

## MVP Timeline

| Day | Task |
|---|---|
| Day 1 | Set up Rust + Soroban CLI, write contract functions, run tests locally |
| Day 2 | Deploy to Stellar Testnet, scaffold React/Vite frontend with Freighter |
| Day 3 | Integrate `register_certificate` and `verify_certificate` in frontend |
| Day 4 | Add `reward_student` dashboard + Convex real-time event feed, polish UI |
| Day 5 | Record demo, finalize README, submit on Rise In |

---

## Submission

| Field | Value |
|---|---|
| **GitHub Repository** | `https://github.com/<your-username>/stellaroid-earn` |
| **Contract ID** | `<YOUR_CONTRACT_ID>` |
| **Stellar Expert** | `https://stellar.expert/explorer/testnet/contract/<YOUR_CONTRACT_ID>` |
| **Program** | [Rise In — Stellar Philippines UniTour](https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan) |

**Short Description:**
> StellaroidEarn is an on-chain credential registry on Stellar. Universities and bootcamps register certificate hashes anchored to student wallets. Students earn XLM rewards upon issuance, anyone can verify in under 5 seconds, and employers pay directly to verified wallet addresses — making every credential tamper-proof and every peso traceable.

### Submission Checklist

- [ ] `cargo test` passes (3 tests)
- [ ] Contract deployed to Stellar Testnet
- [ ] Contract ID saved (starts with `C...`)
- [ ] GitHub repository is public
- [ ] Frontend runs locally without errors
- [ ] Rise In submission form completed

---

## Resources

| Resource | Link |
|---|---|
| Stellar Docs | https://developers.stellar.org |
| Soroban SDK | https://docs.rs/soroban-sdk |
| Stellar CLI Docs | https://developers.stellar.org/docs/tools/stellar-cli |
| Freighter Wallet | https://freighter.app |
| Stellar Expert (Testnet) | https://stellar.expert/explorer/testnet |
| Deploy Guide | https://github.com/armlynobinguar/Stellar-Bootcamp-2026 |
| Full-Stack Example | https://github.com/armlynobinguar/community-treasury |
| Rise In Program | https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for Filipino students and graduates 🇵🇭 · Stellar Philippines UniTour Bootcamp 2026*
