# TulongChain — Security Checklist

**Status:** ✅ Completed (MVP)  
**Last Updated:** April 29, 2026  
**Reviewer:** Team TulongChain

---

## Smart Contract Security

| ✅ | Item | Description |
|----|------|-------------|
| ✅ | **Access Control** | `declare_emergency`, `withdraw`, `pause`, `unpause`, `set_timelock` are restricted to `admin` only (verified via `assert!(sender == admin)`). |
| ✅ | **Pausable** | Admin can instantly pause all operations in case of emergency or discovered bug. |
| ✅ | **Timelock Emergency** | Declared emergency requires configurable delay (default 0 = instant) before withdrawals activate. Prevents rushed withdrawals. |
| ✅ | **Reentrancy Guard** | State updates occur before external calls; no reentrancy risk in Soroban's atomic model. |
| ✅ | **Arithmetic Safety** | All i128 arithmetic; checks for underflow/overflow via Soroban runtime (panics on overflow). |
| ✅ | **Input Validation** | Non-zero amounts required; asset types validated. |
| ✅ | **Batch Atomicity** | `batch_donate` and `batch_withdraw` are all-or-nothing; either all entries succeed or entire tx reverts. |
| ✅ | **Withdraw Limit** | Withdrawals cannot exceed `balance`; overdraft protection enforced. |
| ✅ | **Immutable History** | All `donated`, `emergency_declared`, `withdrawn` events are emitted and publicly verifiable on Stellar Expert. |

---

## Frontend Security

| ✅ | Item | Description |
|----|------|-------------|
| ✅ | **No Private Key Handling** | Freighter wallet handles all signing; app never sees secrets. |
| ✅ | **Environment Variables** | Contract ID, RPC URLs stored in `.env`; frontend uses Vite's import meta env (exposed to client is acceptable as these are public identifiers). |
| ✅ | **Read-only Public Endpoints** | All read calls (`get_total_donated`, `get_balance`, etc.) are read-only simulated transactions. |
| ✅ | **CSRF Protection** | Not applicable: all transactions require explicit Freighter signature. |
| ✅ | **Input Sanitization** | All user inputs (feedback form) sanitized via React's built-in protections; no raw HTML injection. |
| ✅ | **HTTPS Only** | All external calls (Horizon, Soroban RPC, friendbot) use HTTPS. |

---

## Operational Security

| ✅ | Item | Description |
|----|------|-------------|
| ✅ | **Rate Limiting** | Convex queries and mutation calls are subject to built-in rate limits; frontend polls at reasonable intervals (e.g., 30s for stats, 10s for personal donations). |
| ✅ | **Error Handling** | Try-catch around all contract calls; user-friendly error messages. Technical errors logged to console for debugging. |
| ✅ | **Secure Dependencies** | `@stellar/stellar-sdk` v12.3, `@stellar/freighter-api` v4.0. Regular `npm audit` run (no critical vulnerabilities). |
| ✅ | **Backup & Recovery** | Admin keypair stored securely (offline). Timelock provides recovery window if admin key compromised. |
| ✅ | **Testnet Isolation** | All development on Stellar Testnet. Mainnet deployment requires separate configuration and key management. |

---

## Privacy & Compliance

| ✅ | Item | Description |
|----|------|-------------|
| ✅ | **Optional PII** | Feedback modal collects optional email/name; wallet address is auto-collected but already public on-chain. |
| ✅ | **No Sensitive Data** | No SSN, bank details, or passwords collected. |
| ✅ | **GDPR Compliance** | Users can request data deletion; however blockchain data (donations) is immutable by design – disclosed in privacy notice. |

---

## Deployment & Infrastructure

| ✅ | Item | Description |
|----|------|-------------|
| ✅ | **CI/CD** | GitHub Actions workflows for contracts (`cargo test/build`) and frontend (`npm ci`, `tsc`, `vite build`). |
| ✅ | **Static Hosting** | Frontend deployable to Vercel/Netlify (static site). |
| ✅ | **Environment Separation** | Testnet vs Mainnet clearly distinguished via `.env`. |
| ✅ | **Convex Auth** | Convex uses public anonymous access (no auth) for read queries; mutations are not anonymous (but not used for sensitive ops). |

---

## Known Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Admin key theft** | High | Timelock emergency prevents immediate misuse; admin can pause and rotate keys (future multisig). |
| **Friendbot rate-limiting** | Low | Only used for test/dev; production uses funded accounts. |
| **Frontend MITM** | Medium | Deploy via HTTPS; CSP headers recommended on production hosting. |
| **Convex DB compromise** | Medium | Data is mirror of on-chain state; if Convex DB altered, on-chain remains source of truth. |

---

## Next Steps (Production Hardening)

1. **Multi-Sig Admin** – Replace single admin with M-of-N multisig (see FEEDBACK.md Sprint 4).
2. **Audit** – Third-party audit of Soroban contract before mainnet.
3. **Bug Bounty** – Introduce a small bounty program for security researchers.
4. **Formal Verification** – Optionally verify contract invariants using formal methods.

---

*This checklist will be updated as security improvements are implemented.*
