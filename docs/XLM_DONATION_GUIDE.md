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

## Option 2: Redeploy Contract with XLM Support (~5 min)

**Quick Deploy Script**: `scripts/deploy-contract.js` automates everything.

### One-Command Deploy

```bash
cd C:\TulongChain\tulongchain
node scripts/deploy-contract.js
```

What it does:
1. Builds WASM (`cargo build --target wasm32-unknown-unknown --release`)
2. Generates/uses `deployer` key
3. Funds it via Friendbot
4. Deploys contract to testnet
5. Initializes with deployer as admin
6. Prints the new `Contract ID`

### Update Frontend

Edit `frontend/.env`:

```
VITE_CONTRACT_ID=<PASTE_NEW_CONTRACT_ID_HERE>
```

Save and restart frontend if running.

### Test XLM Donation

1. Dashboard → select **XLM** tab
2. Choose `0.1` XLM
3. Click **Donate 0.1 XLM**
4. Freighter popup → Approve
5. ✅ Success! Transaction appears in history below within 5-10s
6. Refresh page — donation persists

---

## What Changed

The new contract includes `donate_xlm( donor, amount )` which:
- Accepts native XLM transfer from donor to contract
- Records donation with `AssetType::Xlm`
- Emits `donated_xlm` event
- Stats (`get_total_donated()`) include both USDC and XLM combined

Your previous USDC donations on the old contract remain on-chain but won't carry over to the new contract (fresh start).

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
