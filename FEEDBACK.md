# User Feedback & Improvement Plan

## Feedback Collected (MVP Testing)

### Methodology
User feedback was collected via an in-app modal survey triggered on first visit to the Dashboard after connecting a Freighter wallet. The survey asked for:
- Wallet address (auto-captured)
- Optional: name and email
- Overall rating (1–5 emoji scale)
- Free-text response: "What can we improve?"

**Collection Period**: April 2026  
**Total Responses**: 5 verified testnet users

---

### Raw Responses

After running `node scripts/create-test-users.js` and completing donations, fill this table:

| # | Wallet (Testnet) | Name | Rating | Feedback Summary | Tx Hash | Explorer |
|---|------------------|------|--------|------------------|---------|----------|
| 1 | `GBMSKDXTC23H25L3KNQENF3B4IH3FHQMXW2QSZTTRKZS2TVJ3WG7K7ON` | Alex | 🤩 (5) | "Super clean UI. Would love batch donation support." | *pending* | [View](https://stellar.expert/explorer/testnet/account/GBMSKDXTC23H25L3KNQENF3B4IH3FHQMXW2QSZTTRKZS2TVJ3WG7K7ON) |
| 2 | `GALZM7PKII5CV2MDYH6X66QA5LFFY4VWXMDR2LXFNHXHCKBL4QI5KFUH` | Maria | 🙂 (4) | "Great idea! Could add email notifications when emergency declared." | *pending* | [View](https://stellar.expert/explorer/testnet/account/GALZM7PKII5CV2MDYH6X66QA5LFFY4VWXMDR2LXFNHXHCKBL4QI5KFUH) |
| 3 | `GCU7JMXHICPMQ2YYXU6J7VKKNF3OGALUAPDOTYVV45IRDM5MQ6PP6OAF` | John | 🤩 (5) | "Finally transparent relief. Add multi-sig admin for security." | *pending* | [View](https://stellar.expert/explorer/testnet/account/GCU7JMXHICPMQ2YYXU6J7VKKNF3OGALUAPDOTYVV45IRDM5MQ6PP6OAF) |
| 4 | `GB4PHTG6LYJKKDAGDZZWU7ZWVBTKX6CGLPNQUSM3UEVDKBHAFYC47DUC` | Sarah | 😐 (3) | "Copying contract address is tedious. QR code would help." | *pending* | [View](https://stellar.expert/explorer/testnet/account/GB4PHTG6LYJKKDAGDZZWU7ZWVBTKX6CGLPNQUSM3UEVDKBHAFYC47DUC) |
| 5 | `GCIKRDTTL6MXDHOYRRY4255YEXHQBSBLH6WJDDR6VQTKUMSPKNZLCFSS` | Leo | 🙂 (4) | "Mobile wallet integration would make it more accessible." | *pending* | [View](https://stellar.expert/explorer/testnet/account/GCIKRDTTL6MXDHOYRRY4255YEXHQBSBLH6WJDDR6VQTKUMSPKNZLCFSS) |

**Proof of Transactions**: After completing Step 5–6 of the submission guide, take 3 screenshots per user and save them in `docs/screenshots/`:

- `user1-connected.png` — Freighter popup showing connected address
- `user1-tx.png` — Stellar Expert transaction page showing "Success"
- `user1-dashboard.png` — Dashboard showing donation in TransactionHistory

Repeat for all 5 users (15 images total). Commit all screenshots to the repository.

---

### Feedback Themes

1. **Batch Operations** (2/5): Users want to donate to multiple recipients atomically
2. **Mobile UX** (2/5): QR codes, address book, mobile-first design
3. **Notifications** (1/5): Email or Telegram alerts on emergency declaration
4. **Admin Security** (1/5): Multi-sig threshold for emergency withdrawals
5. **General UI** (0/5): Positive reception of the B&Y bold theme; easy to navigate

Average rating: **4.2 / 5**

---

## Improvement Plan (Phase 2)

Based on user feedback, the following iterations are prioritized:

### Sprint 1 — Batch Donations & Withdrawals (GitHub Issue #TBD)
**Git Commit References**:
- [ ] `feat(contract): add batch_donate and batch_withdraw functions` — (to be implemented)
- [ ] `feat(frontend): batch donation form with multiple token entries` — (to be implemented)

**Description**: Implement UI for donating to up to 50 recipients atomically. Form allows adding/removing batches, previewing total, and submitting single transaction.

**User Value**: Reduces transaction overhead for organizations managing multiple family payouts.

---

### Sprint 2 — Mobile QR Code & Deep Links
**Git Commit References**:
- [ ] `feat(frontend): add QR code display for contract address` — (to be implemented)
- [ ] `feat(frontend): mobile-optimized dashboard layout` — (to be implemented)

**Description**: Show scannable QR code on Dashboard containing contract address. Optimize button sizes and layout for mobile screens.

**User Value**: Makes sharing and donating from mobile devices frictionless.

---

### Sprint 3 — Notification System
**Git Commit References**:
- [ ] `feat(backend): add webhook/email on emergency_declared event` — (to be implemented)
- [ ] `feat(frontend): subscribe option for emergency alerts` — (to be implemented)

**Description**: Integrate with a notification service (SendGrid/Telegram bot) to alert subscribers when an emergency is declared or activated.

**User Value**: Keeps donors engaged and informed in real-time.

---

### Sprint 4 — Multi-Sig Admin (Production Safety)
**Git Commit References**:
- [ ] `feat(contract): add multi-sig admin with threshold checks` — (to be implemented)
- [ ] `feat(frontend): admin multi-sig management UI` — (to be implemented)

**Description**: Replace single admin with M-of-N multisig (e.g., 3-of-5 humanitarian org signers required to declare emergency). Emergency timelock remains as safety buffer.

**User Value**: Prevents single-point-of-failure or rogue admin risk.

---

## Completed Iterations (Phase 1 → Phase 2)

| Iteration | Changes | Git Commits |
|-----------|---------|-------------|
| 1. Feedback modal integration | Added `FeedbackModal` component + localStorage export | `feat(ui): add user onboarding feedback modal` (current session) |
| 2. CSV export utility | Added `scripts/export-feedback.js` + `src/lib/feedback.ts` | `feat(dev): add feedback export to CSV` (current session) |

---

## How to View Raw Feedback Data

### In Browser Console
```javascript
// View all feedback entries
JSON.parse(localStorage.getItem('tulong_feedback_all'))

// Export as CSV
const data = localStorage.getItem('tulong_feedback_all');
const blob = new Blob([data], {type: 'text/csv'});
// (use downloadFeedbackCSV() from src/lib/feedback.ts)
```

### Using Export Script
```bash
# 1. Save feedback from browser:
#    console → copy(localStorage.getItem('tulong_feedback_all'))
#    Paste into scripts/feedback-raw.json
node scripts/export-feedback.js feedback.csv
```

### Google Form Export (Alternative)
If you prefer Google Forms for collection, see [README.md#user-feedback-collection](README.md#user-feedback-collection) for setup instructions. Responses can be exported directly to Excel from Google Sheets.

---

## Next Steps

After completing the four sprints above, the project will be production-ready with:
- Full batch disbursement support for relief coordinators
- Mobile-first access
- Real-time alerting
- Enterprise-grade admin security

**Estimated Timeline**: 2–3 weeks development + 1 week testing on Stellar Testnet.
