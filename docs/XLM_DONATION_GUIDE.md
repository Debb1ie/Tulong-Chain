# XLM Donation Guide — Quick Start

## Current Situation

- **Deployed contract** (on testnet) only supports USDC donations via `donate()`.
- You tried to donate but got error: `trustline entry is missing` because your wallet has no USDC trustline.
- We added `donate_xlm()` to the contract code (pushed to GitHub), but the **live contract doesn't have it yet**. To use XLM, you must redeploy.

---

## Option 1: Use USDC (Fastest — ~2 min)

**Add USDC trustline to Freighter:**

1. Freighter → **Assets** tab → **+ Add Asset**
2. Asset Code: `USDC`
3. Issuer: `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`
4. Confirm (costs ~0.01 XLM)

**Get free test USDC:**

- Visit https://faucet.circle.com/
- Connect Freighter (Testnet)
- Request 1+ USDC

**Donate:**

Back to Dashboard → select **USDC** tab → Choose amount → Donate → ✅

History updates instantly. Refresh page — history persists.

---

## Option 2: Redeploy Contract with XLM Support (~10 min)

If you prefer to donate native XLM (no trustline needed), follow these steps to update the live contract:

### Step 1 — Build WASM

```bash
cd C:\TulongChain\tulongchain\contracts
cargo build --target wasm32-unknown-unknown --release
```

WASM file: `target/wasm32-unknown-unknown/release/tulong_chain.wasm`

### Step 2 — Deploy to Testnet

```bash
# Use your existing key or generate new
stellar keys generate deployer --global

# Fund it (if not already)
curl "https://friendbot.stellar.org?account=$(stellar keys address deployer)"

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source deployer \
  --network testnet
```

**Copy the new Contract ID** returned (looks like `C...`).

### Step 3 — Initialize Contract

```bash
stellar contract invoke \
  --id <NEW_CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address deployer)
```

### Step 4 — Update Frontend Config

Edit `frontend/.env`:

```
VITE_CONTRACT_ID=<NEW_CONTRACT_ID>
```

Save file. Restart frontend if running: `Ctrl+C` then `npm run dev`.

### Step 5 — Test XLM Donation

1. Dashboard → select **XLM** tab
2. Choose amount (e.g., 0.1 XLM)
3. Click **Donate 0.1 XLM**
4. Freighter popup → Approve
5. ✅ Success! Transaction appears in history.

Refresh page — history stays (read from chain).

---

## FAQ

**Q: Do I need to redeploy every time?**  
A: Only if you add new contract functions. The current deployed contract lacks `donate_xlm`. That's why we need a redeploy.

**Q: Will my previous USDC donations be lost?**  
A: No. Old contract stays on-chain. The new contract will start fresh at zero. If you want continuity, you must keep using the same contract ID (cannot reuse). So either stick with USDC on old contract, or start fresh with XLM on new contract.

**Q: Which is easier for the 5 test users?**  
A: USDC — they just need to add trustline once and get USDC from faucet. No redeploy needed. XLM route requires redeploying and reinitializing contract, and also needs admin actions.

**Recommendation**: Use **Option 1 (USDC)** for the MVP submission. It's simpler and already working on the current contract.

---

## TL;DR

If you only have XLM and want to donate immediately:

1. Add USDC trustline → get USDC from Circle faucet
2. Donate USDC using the button on Dashboard

If you insist on XLM donations, redeploy as in Option 2.
