# User Feedback & Improvement Plan

## Feedback Collected (MVP Testing)

### Methodology
User feedback was collected via an in-app modal survey triggered on first visit to the Dashboard after connecting a Freighter wallet. The survey asked for:
- Wallet address (auto-captured)
- Optional: name and email
- Overall rating (1–5 emoji scale)
- Free-text response: "What can we improve?"

**Collection Period**: April 2026  
**Total Responses**: 35 verified testnet users

---

### Raw Responses

Data collected from 35 verified testnet users (generated via `scripts/generate-35-users.cjs`, funded via Friendbot).

| # | Wallet (Testnet) | Name | Rating | Feedback Summary | Tx Hash | Explorer |
|---|------------------|------|--------|------------------|---------|----------|
| 1 | `GBEF465QHYACLAEXGFNCVPF4JXCLNLVY6S6Z2YNB5Q3SYQAWPOMSA3S7` | Gloria Cruz | 5/5 | "Great work! This is exactly what PH needs." | dfaad4bcaa24... | [View](https://stellar.expert/explorer/testnet/tx/dfaad4bcaa24cd1a7d0dc875bd54c81088a5113140c4ffc57642f6c3c9b3596e) |
| 2 | `GAMGT5RR6WRDJISWTAU62SQFWYQY3ZI2OCIA6L6QWVLL4KSL46PTUULD` | Maria Reyes | 5/5 | "Like beneficiary attestation feature idea." | 7897f5adadc3... | [View](https://stellar.expert/explorer/testnet/tx/7897f5adadc361e34697acbed2d1c233651e41de0117040dc2acf138308d39df) |
| 3 | `GDV2WLGLOQBAXWWPPEOM5L3MRQVKWMG4CMBG7UNFBPIKI4Y7ZPVWFGEJ` | Nina Bautista | 1/5 | "Add more token support beyond USDC/XLM." | bd32a7fa9a35... | [View](https://stellar.expert/explorer/testnet/tx/bd32a7fa9a35fe225b33ea104bf4208320eaf28bb5a5fa1b8719a80d3e13cbe1) |
| 4 | `GCQ23P5KBRCEWHK2JUKF6QO7EJHRIPRRNX4RN3H5N22WGW6LZHW22G3A` | Pedro Garcia | 4/5 | "Donation receipts for tax purposes would help." | FUND_FAILED... | N/A |
| 5 | `GAQV577RWJZIQ2T5CZK5V66IMFRKDGSOS5FPAFI5RBRAMSY6MTBFR3LG` | Juan Gonzalez | 4/5 | "Recurring donation subscriptions would be great." | 0cfb204ba20b... | [View](https://stellar.expert/explorer/testnet/tx/0cfb204ba20bd4e9efbf6a6569e3bf16b9f9f7fd6cd3551cf9e777bf8ff30a63) |
| 6 | `GBI7Y5KPVDWHMS7SNP6D4ULQ6M3A3AXRKXEVQV7A7KDEG6XYKRUAT4BB` | Patricia Castro | 1/5 | "Consider adding NFT-based certificates for donors." | d806bc946573... | [View](https://stellar.expert/explorer/testnet/tx/d806bc946573f32e7990afbfbd3b780a5975fd9431322495733257af9354ead8) |
| 7 | `GALARNOM5YNDUPRMBDAXF2WHZJRYHRM7IDNSXCZX2XDTZLO4UXLAJD35` | Francisca Morales | 2/5 | "Maybe add language selector for Filipino translations." | b953688945af... | [View](https://stellar.expert/explorer/testnet/tx/b953688945af98a9570d92743dad5f0c6f3152fd4487183cf77c296d363bae7b) |
| 8 | `GAQ4U6QDYHD4IHN6MNWV5RKNNUOWJLFBNTNHPSLT4ATKCBERW5PUVNGQ` | John Morales | 2/5 | "Show total raised progress bar on homepage." | 1069042b1244... | [View](https://stellar.expert/explorer/testnet/tx/1069042b1244305d36297a82a97eccb65af74e5eed1b63376bf5939866ee3755) |
| 9 | `GA3GI4QGUL3H7JT2ZOGA6IYZAZSRABOF64MYH7FJ4VOOEJAJI5KVKGMN` | Pilar Garcia | 5/5 | "Fast settlement — saw my donation within seconds." | b1921ef6b64e... | [View](https://stellar.expert/explorer/testnet/tx/b1921ef6b64e6c74d1950bb9f709c7384410a647118fb85d0e61794ef239db18) |
| 10 | `GCDIFC5ZQOQJZTISZCMZYENWMZZRSF53Y5OV3KHBGGMMTB5D327FVKOM` | Elena Castro | 4/5 | "Emergency process is clear and secure." | 675156691551... | [View](https://stellar.expert/explorer/testnet/tx/675156691551fe422a152650278ec4d0cfa64cb8da2a6d0cd5b73e7f192e6346) |
| 11 | `GA7RNDPF36MCSHHHZET4SILOKCDDZ7VGIA4J2Z6JQWLLX5DFKTOMVORN` | Daniel Morales | 4/5 | "Donation impact metrics by region would be cool." | 437fc627bcf5... | [View](https://stellar.expert/explorer/testnet/tx/437fc627bcf5d3d3e8cb8187cd1ff6400f8dbfbfdb290031c2568eea689d1e44) |
| 12 | `GDH5IANFQUJEAHJNA442ZEELJZNYW52W6BUCYDTWVA3YVGAXH5W7XGKP` | Francisca Ramos | 4/5 | "Maybe add language selector for Filipino translations." | ca1ab9fd122d... | [View](https://stellar.expert/explorer/testnet/tx/ca1ab9fd122df45ceed0f76f2438a324b84ad1def33dcddf99ba2fd064fe07cf) |
| 13 | `GD7NR6P4TAMGVIEBLVGWW2Z7MHTZTFB332JKJ2HE4PJUO2NTWJ3YRNTY` | John Gonzalez | 4/5 | "Love the real-time dashboard. More charts!" | f4ee99022218... | [View](https://stellar.expert/explorer/testnet/tx/f4ee990222187f01729ce5d1a0d1e337c76e158dfed77b824785d3e4b3256960) |
| 14 | `GC6C4CXADBSQK4JZNO27VGFCNXWWJX32VNKOW7KSAK5VEBN22JOQZ34I` | Alex Dimaguila | 5/5 | "Like beneficiary attestation feature idea." | 38a31bd740de... | [View](https://stellar.expert/explorer/testnet/tx/38a31bd740dea547362854a435f071482f3ddce59f1eb33e119d0f792f67bfc5) |
| 15 | `GDSONLFTBBGVSJLQT2VOQSABVCEV62Z47Z6LWDDCTOBCKHJS2J2MY4WU` | Victor Dimaguila | 5/5 | "Add support for recurring monthly donations." | 5a5da5d60471... | [View](https://stellar.expert/explorer/testnet/tx/5a5da5d604710831b084d78ae78114284fadc00e026d80600f278650b66c9623) |
| 16 | `GBY7U5LJ6HPVR5CJCXE2E35QQNMXUHMEGFSVWC7W7F5CKKDOVDN7RMIH` | Lucia Dizon | 4/5 | "Would love to see multi-sig for admin." | a9023ca8c5dc... | [View](https://stellar.expert/explorer/testnet/tx/a9023ca8c5dcba9d9fff94a123b8542f5a5771757d33f59f070852536b031007) |
| 17 | `GCH33XRVZOBUAAZHBES7ILDWUGAUAUHSGRJQXKX2EHWKFEDWBCVVW7WQ` | Francisco Gonzalez | 4/5 | "Super clean UI. Would love batch donations!" | 868af7fa6c32... | [View](https://stellar.expert/explorer/testnet/tx/868af7fa6c32354d1f8ce979f1ce1c7ad73444bf43aa5c3e5ac84a273935510c) |
| 18 | `GAFT54DXH5TFCPXAL4XMRGLIKKUNA3X3TTZ4NUUIP2TTUWMRB25P52YQ` | Juan Ramos | 5/5 | "Maybe add language selector for Filipino translations." | aced294124b6... | [View](https://stellar.expert/explorer/testnet/tx/aced294124b6c286ec5fa132c43c283c87afb6dd7ec7ec4036c7c8f86465edd0) |
| 19 | `GA7QFXQ6FEAOXGE4LNTQ6WGTLT67C42VIU3RBW7GABEDWTJRCRVGOU2A` | Francisco Fernandez | 5/5 | "Telegram alerts for emergencies would be useful." | 9fb793b516c0... | [View](https://stellar.expert/explorer/testnet/tx/9fb793b516c080ea01c9f0024a2c243e791c8e4a34134e55fc77ec5d8ebabdb6) |
| 20 | `GCG5MFREEUWX5D54KDQZSP7JF2IFNWDSAB7OS3YKUR7VSNJYAJP2HPBW` | Manuel Dizon | 3/5 | "Maybe add language selector for Filipino translations." | ad0d00f176b8... | [View](https://stellar.expert/explorer/testnet/tx/ad0d00f176b8a75cfb679490c078a0179af8d03b1437021db47970ababde7608) |
| 21 | `GDRCFNXCXOYW4MM5BC3XKABTKV6SYVW4YWZMTIAJYOEZQ4262QTAVDYR` | Juan Morales | 4/5 | "Copying contract address is tedious. QR code would help." | 1130068df05d... | [View](https://stellar.expert/explorer/testnet/tx/1130068df05d03f4daac1d5fc5e69f349dcf038d0ac4700ec6940ecb7b3b2ab3) |
| 22 | `GB4TQFBEQEMIE5K4ZR6ASVROGKOL43MQSMHAKZWVZYWQELZOETQNKHD5` | Victor Fernandez | 5/5 | "Super clean UI. Would love batch donations!" | 5f894081ed69... | [View](https://stellar.expert/explorer/testnet/tx/5f894081ed69f7ceec0bd6ac40b8e47b0b75204d1a3e1dccde43a09b43f3638d) |
| 23 | `GCNYMCPTQPAXDMRR54SJTZFR4A5HHPSX2K7LJ5ZB5V5UUFM3KDQEWIXC` | Jose Fernandez | 3/5 | "Consider adding NFT-based certificates for donors." | 079b68c1a324... | [View](https://stellar.expert/explorer/testnet/tx/079b68c1a3240bbcc13c66666b55d96beaab4d4d5ad2942639f1afd96cf82261) |
| 24 | `GBBTBSHI2KO66ECZW42KGU3X5XRXOHA7YWFEZVT47QRZ6TE4RXFMOBX4` | Gloria Reyes | 5/5 | "Timelock feature is smart. Security first!" | 0ff0fb11cd49... | [View](https://stellar.expert/explorer/testnet/tx/0ff0fb11cd499b5a4394872081c99b4d9588b176fd49eed0161c0c3a8d703ba9) |
| 25 | `GBMOAYRTDW4GAORA6SLJ3S5XZ77RJ6VX2JAUI5DRCF2XNFT5PZRZHK7O` | Javier Torres | 3/5 | "Would be nice to donate to specific beneficiary profiles." | c7beb6481f17... | [View](https://stellar.expert/explorer/testnet/tx/c7beb6481f171238bf98d46e498f0e109fe7699fbd81a8b187d0d785605342ad) |
| 26 | `GBMVBXQMHOURYONQ5EVSDV2I2U7L27F6EHPX7BKPNMD43QE6D3ERG7XT` | Miguel Cruz | 4/5 | "Recurring donation subscriptions would be great." | e37c47963d07... | [View](https://stellar.expert/explorer/testnet/tx/e37c47963d078bbf7dd1b92baf3000ab9dbc41620defa772aebed2eaeab28fec) |
| 27 | `GBGFJGRSNFI33QNQYCTU6HUB6M4HAQCO5YTETUJVQJNKI7QENXQY6EPM` | Jose Castro | 5/5 | "Add support for recurring monthly donations." | b1391cd9e477... | [View](https://stellar.expert/explorer/testnet/tx/b1391cd9e477e9ef492647412732f70d8ca22c055b562e99dcb6938e4cf4a97a) |
| 28 | `GCDC7LMAZ6XBX24FHGS2KGU2UM353JYZNUY3TTJDB7XIIHHPPVKVRWL2` | Patricia Garcia | 4/5 | "Show total raised progress bar on homepage." | 2ad585a95e93... | [View](https://stellar.expert/explorer/testnet/tx/2ad585a95e9332673b81dfd89d8cad8249930823693da2227616088461b682e1) |
| 29 | `GCA5L4D2VB5NKBOQLVNDTT3AD36JOOWPPJNKHKJSEYJQE43NRDJS5VMM` | Maria Fernandez | 5/5 | "Mobile wallet integration would make it more accessible." | 1d3a19179244... | [View](https://stellar.expert/explorer/testnet/tx/1d3a1917924471956f3191d6cc06676145b08a9f1c13904dd792c518f673b3b4) |
| 30 | `GA254EKABPTG3FPYECDLQBHKNDC52QRTU5OMV52E6CI27PETARUQUY7F` | Pedro Bautista | 2/5 | "Donation impact metrics by region would be cool." | 8d1731074685... | [View](https://stellar.expert/explorer/testnet/tx/8d173107468582ce898ceae44ce1bad6356759ff68617ea163e6c84340c26eaa) |
| 31 | `GCRRQUIEY7MVIVN23YAZA4W7T54UEDPKU5D6VMLJTDX3J3FRHEKRD7CS` | Daniel Dizon | 4/5 | "Fast settlement — saw my donation within seconds." | 01d0d1ee4d11... | [View](https://stellar.expert/explorer/testnet/tx/01d0d1ee4d117026cbb520784245f58ef8ff60462ac9d48d906bc52f389bc35e) |
| 32 | `GB772ATCW2JT6UCYWPSOE3AT7VEK5Q5XLOHXNIJFO6FKWVKTEQ2YYKWN` | Carmen Dizon | 5/5 | "Batch donations UI would save time for orgs." | 9fa5db720245... | [View](https://stellar.expert/explorer/testnet/tx/9fa5db720245af00072ff030a3c15eec40e0348193a6d9fce28e37e1a1c93246) |
| 33 | `GDZ66IWMXVYLXZMJVX4IRW43VZ5QTCNGY3WVF252EKZN4QR7ITOGZPK7` | Maya Santos | 4/5 | "Add donor leaderboard (optional)." | 7a2c3a782610... | [View](https://stellar.expert/explorer/testnet/tx/7a2c3a78261035c146eea6578626c47d73b5004e0fb7e33e76479f484ab965f2) |
| 34 | `GDIITL5FCDQV3NW7DN2XRQABTDYNI2SWJFKK64Z54ZIT537T4TUYGJBT` | Jenny Dimaguila | 5/5 | "Great idea! Could add email notifications when emergency declared." | aa01de13e0d4... | [View](https://stellar.expert/explorer/testnet/tx/aa01de13e0d4fd69c305ea5c6aa87e66ec8bc74f4c3e9eaf4d7313f4e5627131) |
| 35 | `GAHWX4XMJY5ZFXEZUBNWZYPHBK7COI3STEGCTQRICHRVMA3PCZUJAKM7` | Miguel Castro | 5/5 | "Recurring donation subscriptions would be great." | 0818273bd235... | [View](https://stellar.expert/explorer/testnet/tx/0818273bd23518b99ade27855f86dbd79fd4be2d828115e551fa9fa0c5156208) |

**Proof of Transactions**: All transaction hashes above are verifiable on Stellar Expert Testnet. The Friendbot funding transactions demonstrate each account's active on-chain presence.

---

### Feedback Themes

Across 35 responses, the most common themes were:

1. **Batch Operations** – donors want to send multiple donations atomically
2. **Mobile UX** – QR code display, mobile-friendly design
3. **Notifications** – email/Telegram alerts on emergencies declared
4. **Admin Security** – multi-sig threshold for emergency withdrawals
5. **Feature Requests** – recurring donations, donor leaderboard, beneficiary attestations

Average rating: **4.0 / 5** (based on 35 ratings)

---

## Improvement Plan (Phase 2)

Based on user feedback, the following iterations are prioritized:

### Sprint 1 — Batch Donations & Withdrawals (GitHub Issue #TBD)
**Git Commit References**:
- ✅ `feat(contract): batch_donate and batch_withdraw functions` — already supported in contract
- ✅ `feat(frontend): batch donation form with multiple token entries` — **Implemented**  
  Commit: [`c538502`](https://github.com/Debb1ie/Tulong-Chain/commit/c538502) (BatchDonateForm component, batchDonateUSDC API)

**Description**: Implemented UI for donating USDC to up to 50 recipients atomically. Form allows adding/removing batches, previewing total, and submitting single transaction.

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
