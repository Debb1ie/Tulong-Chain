# Testnet User Generation Instructions

## Method 1: Manual (Easiest)

1. Open Freighter wallet (set to **Testnet**)
2. Click "Create New Account" → copy the **Address** and **Secret Key**
3. Fund it via Friendbot: Open https://friendbot.stellar.org?account=YOUR_ADDRESS
4. Donate 0.1–1 USDC or XLM to the contract:
   - Copy contract ID: `CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC`
   - Send from Freighter to that address
5. Capture **3 screenshots** per user:
   - Freighter showing connected wallet address
   - Sent transaction (Freighter transaction history)
   - Stellar Expert transaction confirmation: https://stellar.expert/explorer/testnet/tx/TX_HASH

Repeat for 5 users.

---

## Method 2: CLI Automated (If Stellar CLI installed)

```bash
# Create a folder for accounts
mkdir -p testnet-users
cd testnet-users

# Generate 5 accounts and fund them
for i in 1 2 3 4 5; do
  echo "=== User $i ==="
  stellar keys generate user$i --global
  stellar keys address user$i
  curl "https://friendbot.stellar.org?account=$(stellar keys address user$i)"
  echo
done

# Donate from each account (0.1 USDC each)
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source user1 \
  --network testnet \
  -- donate \
  --donor $(stellar keys address user1) \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 10000000

# Repeat for user2–user5, then copy transaction hashes
```

---

## Data to Collect Per User

| Field | Where to Get It |
|-------|------------------|
| Wallet Address | Freighter popup or `stellar keys address user1` |
| Secret Key | Freighter settings → Export Private Key |
| Donation Tx Hash | Stellar Expert URL after donation |
| Screenshots | Save `.png` files to `docs/screenshots/` |

---

## Final Output

After creating 5 users and donating:

Update `FEEDBACK.md` User table:

```markdown
| 1 | `GAXXXXXX` (full: `GAXXXXXX...`) | User 1 | 🤩 (5) | "Super clean UI..." |
```

Replace the simulated data with your real testnet addresses and links.

Commit screenshots to git (add to `.gitignore` if you don't want them public — but for submission, include them in the repo).
