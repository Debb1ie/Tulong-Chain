# Test Users — Real Donation Verification

Once you run `node scripts/create-test-users.js`, you'll have:

## Output File

`scripts/test-users-output.json` contains all generated data:

```json
{
  "generatedAt": "2026-04-29T...",
  "contractId": "CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC",
  "network": "testnet",
  "users": [
    {
      "id": 1,
      "name": "Alex",
      "wallet": "GDNKJ6VD4UIYUPZYTKMHAMFBF34ZUBCJN6N4C6PP4OCFYZGQZVWSCWBN",
      "secret": "S...",
      "rating": 5,
      "feedback": "...",
      "donationAmount": 0.1,
      "txHash": "abc123...",
      "explorer": "https://stellar.expert/explorer/testnet/tx/abc123..."
    }
  ]
}
```

## What to Do After Running Script

1. **Copy wallet addresses** from the output JSON
2. **Connect Freighter** to each wallet (import secret key)
3. **Take 3 screenshots per user**:
   - Dashboard showing connected address
   - Transaction history showing donation
   - Stellar Expert tx page showing "Success"
4. **Upload screenshots** to `docs/screenshots/` (create this folder)
5. **Update FEEDBACK.md**:
   - Replace placeholder table rows with real addresses & tx hashes from JSON
   - Add links to Stellar Explorer for each tx

## Screenshot Checklist

For each of the 5 users:

- [ ] **Connected** — Dashboard top-right shows wallet address `GD...`
- [ ] **Donation visible** — TransactionHistory component shows their donation
- [ ] **Explorer proof** — Stellar Expert page open, shows transaction success, hash visible in URL

Save as:
- `docs/screenshots/user1-connected.png`
- `docs/screenshots/user1-tx.png`
- `docs/screenshots/user1-dashboard.png`

Commit all images and push to GitHub.
