# MVP Submission Guide — TulongChain

This guide walks you through completing the final submission steps for the Stellar Philippines UniTour Bootcamp 2026.

## Prerequisites

- Freighter wallet (Testnet mode) installed
- Stellar CLI installed (see README)
- Node.js 18+
- Git

---

## Step 1: Generate 5 Testnet Users (script creates addresses)

```bash
cd C:\TulongChain\tulongchain
node scripts/create-test-users.js
```

Output: 5 wallet addresses + secret keys. The script saves `scripts/test-users-output.json`.

**What the script does:**
- Creates 5 new Stellar testnet keypairs
- Prints address, secret key, rating, feedback text
- **Does NOT** fund accounts or make donations (you'll do that manually)

---

## Step 2: Import Wallets into Freighter

For each user (repeat 5 times):

1. Open Freighter → Settings → **Add Existing Account**
2. Paste the **Secret Key** from script output
3. Account appears in Freighter

---

## Step 3: Fund Accounts with XLM (for transaction fees)

Each account needs enough XLM to cover contract invocation fees (~0.1 XLM). Use Friendbot:

```
https://friendbot.stellar.org?account=GDNKJ6VD4UIYUPZYTKMHAMFBF34ZUBCJN6N4C6PP4OCFYZGQZVWSCWBN
```

Open in browser, repeat for all 5 addresses.

---

## Step 4: Get Testnet USDC

The contract accepts USDC donations. Each account needs USDC balance.

1. Go to [Circle Testnet Faucet](https://faucet.circle.com/)
2. Connect Freighter (the account you're currently using)
3. Request 1 USDC to the same address
4. Repeat for all 5 accounts

> If the faucet limits you to one request per wallet, you can instead:
> - Use one funded account to send USDC to the other 4 accounts (`Payment` op in Freighter)
> - Amount: 0.5 USDC each

---

## Step 5: Make Donations

For each account:

1. Connect Freighter to the dashboard (http://localhost:5173 or Vercel link)
2. The **FeedbackModal** will appear. You can submit or skip.
3. Copy the Contract Address: `CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC`
4. In Freighter, click **Send** → paste address → Asset: **USDC** → Amount:
   - User 1: 0.1 USDC
   - User 2: 0.15 USDC
   - User 3: 0.2 USDC
   - User 4: 0.25 USDC
   - User 5: 0.3 USDC
5. Confirm and sign
6. Wait ~5 seconds for confirmation

**Capture the Transaction Hash**:
- The terminal where you ran the script? No — the donation is signed in Freighter UI. You can view the transaction in Freighter's history or Stellar Expert. Click the transaction in Freighter to open in Explorer, copy the hash from URL.

Alternatively, run the script `create-test-users.js` with `--auto` flag (future) but manual is fine.

---

## Step 6: Take Screenshots (required for submission)

For each user, capture **3 screenshots**:

1. **Connected** — Dashboard header shows wallet address `GD...` (top-right "Connected" badge)
2. **Donation in UI** — TransactionHistory component shows your donation (amount, purpose N/A)
3. **Explorer proof** — Stellar Expert page with:
   - Transaction hash in URL
   - Status: "Success"
   - Operations showing transfer to contract

**Save files:**
```
docs/screenshots/user1-connected.png
docs/screenshots/user1-dashboard.png
docs/screenshots/user1-tx.png
... repeat for user2–user5
```

---

## Step 7: Update FEEDBACK.md with Real Data

Fill the table with actual tx hashes and explorer links:

```markdown
| 1 | `GDNKJ6VD...` | Alex | 🤩 (5) | "Super clean..." | `6eb7533a803a15312...` | [Link](https://stellar.expert/explorer/testnet/tx/6eb7533a803a15312...) |
```

You can copy-paste the tx hash from Stellar Expert URL.

---

## Step 8: Commmit Everything

```bash
git add docs/screenshots/
git add FEEDBACK.md
git add scripts/
git commit -m "feat(test): add 5 real testnet users with proof screenshots"
```

Make sure you have at least 10 meaningful commits (already yes).

---

## Step 9: Demo Video (placeholder)

Record a 2–3 min Loom or OBS screen recording:

1. Landing page overview
2. Connect Freighter
3. Donate (copy address, send from Freighter)
4. Show dashboard receiving donation in real-time
5. Admin declare emergency (if admin)
6. Show transaction on Stellar Expert
7. Show transaction history component

Upload to YouTube (unlisted). Update README's Demo Video link.

---

## Step 10: Final Submission Checklist

- [ ] Public GitHub repository (yes)
- [ ] README with complete documentation (yes)
- [ ] Architecture document (ARCHITECTURE.md) (yes)
- [ ] 10+ meaningful commits (20+ already)
- [ ] Demo video link (you must record)
- [ ] 5 user wallet addresses listed in README (placeholders now; fill after Step 1)
- [ ] Feedback Excel/Google Form linked (sample CSV present; optional Google Form)
- [ ] Screenshots in `docs/screenshots/` (15 images)
- [ ] User feedback analysis (FEEDBACK.md)

---

## Troubleshooting

**Friendbot says "Account exists"** — Already funded. Move to next step.

**USDC trustline not established** — When sending USDC via Freighter, it will prompt to add trustline. Accept it.

**Transaction pending** — Wait up to 30s; refresh dashboard.

**Can't connect Freighter** — Ensure you're on Stellar Testnet (Freighter network selector).

---

Estimated Time: 30–45 minutes to complete all manual steps.
