# Screenshots — Test User Verification

Place 15 screenshots here (3 per user) proving real testnet interactions.

## Required Images

For each user 1–5:

| File | Content |
|------|---------|
| `user1-connected.png` | Freighter popup showing connected wallet address `GDNKJ6...` |
| `user1-tx.png` | Stellar Expert transaction page showing successful donation (tx hash visible) |
| `user1-dashboard.png` | Dashboard TransactionHistory component showing the donation entry |

Same for user2–user5. Use consistent naming.

## How to Capture

1. **Connect**: On Dashboard, click "Connect Freighter", approve in Freighter popup → take screenshot showing address in top-right badge.
2. **Donate**: Send 0.1–0.3 USDC to contract from Freighter. After 5–10s, Dashboard TransactionHistory updates → screenshot.
3. **Verify**: Open Stellar Expert link for the tx (from console output) → screenshot showing status "Success" and hash.

## Git Commit

```bash
git add docs/screenshots/
git commit -m "docs: add screenshot proof for 5 testnet users"
```
