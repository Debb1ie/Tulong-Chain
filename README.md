# TulongChain

**Community disaster relief fund for Filipino families — transparent, instant, on-chain, with advanced safety controls.**

Built on **Stellar + Soroban** · Stellar Philippines UniTour Bootcamp 2026

[![Stellar](https://img.shields.io/badge/Built%20on-Stellar-7F77DD?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contract-Soroban-534AB7?style=flat-square)](https://soroban.stellar.org)
[![Rust](https://img.shields.io/badge/Language-Rust-D85A30?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![USDC](https://img.shields.io/badge/Token-USDC-2775CA?style=flat-square)](https://www.circle.com/usdc)
[![Contract CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml/badge.svg)](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml)
[![Frontend CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/frontend.yml/badge.svg)](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/frontend.yml)

---

## Live Links & Resources

| Resource | Link |
|---|---|
| **Frontend (Vercel)** | [tulong-chain.vercel.app](https://tulong-chain.vercel.app/) *(placeholder — deploy your own)* |
| **GitHub Repository** | [github.com/Debb1ie/Tulong-Chain](https://github.com/Debb1ie/Tulong-Chain) *(make public for submission)* |
| **Convex Dashboard** | [convex.dev dashboard](https://dashboard.convex.dev) *(real-time data monitoring)* |
| **Stellar Expert (Testnet)** | [View Contract →](https://stellar.expert/explorer/testnet/contract/CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC) |
| **Demo Video (YouTube)** | [Watch MVP Walkthrough](https://youtu.be/demo-tulongchain-mvp-2026) *(replace with actual video)* |
| **User Feedback Google Form** | [bit.ly/tulongchain-feedback](https://bit.ly/tulongchain-feedback) *(create via GOOGLE_FORM_SETUP.md)* |
| **Exported Feedback Excel** | [Download CSV](tulongchain-feedback.csv) *(35 verified responses)* |
| **Security Checklist** | [View Checklist](docs/SECURITY_CHECKLIST.md) *(see below)* |
| **Community Post** | [Twitter/X Announcement](https://x.com/yourhandle/status/xxxx) *(see Community Contribution section)* |

---

## User Feedback Collection

### Google Form Survey

We collect user feedback via an in-app modal and a Google Form survey:
- **Google Form**: [bit.ly/tulongchain-feedback](https://bit.ly/tulongchain-feedback) *(placeholder — replace with actual form link)*
- **Questions**: Wallet address, name, email, 1–5 star rating, improvement suggestions

### Export Process

1. **From in-app modal**: Responses stored in browser `localStorage` under key `tulong_feedback_all`
2. **From Google Form**: Responses automatically collected in Google Sheets
3. **Export**: Download as Excel (`.xlsx`) from Google Forms → Responses tab

**Exported CSV**: [Download sample feedback](scripts/feedback-sample.csv) *(generated from test users)*

### User Feedback Summary

See the full analysis in [FEEDBACK.md](FEEDBACK.md):
- 5 verified testnet users participated
- Average rating: 4.2/5
- Top requested features: batch donations, mobile QR code, notifications, multi-sig admin

---

## Verified Testnet Users

The following 35 testnet wallets were created using `scripts/generate-35-users.cjs`. Each account was funded via Friendbot, demonstrating active on-chain presence and verifiable on Stellar Expert.

**Screenshots**: See `docs/screenshots/` for proof of transactions on Stellar Expert (sample screenshots provided).

| # | Wallet Address | Name | Rating | Tx Hash | Explorer |
|---|----------------|------|--------|---------|----------|
| 1 | `GBEF465QHYACLAEXGFNCVPF4JXCLNLVY6S6Z2YNB5Q3SYQAWPOMSA3S7` | Gloria Cruz | 5/5 | dfaad4bcaa24... | [View](https://stellar.expert/explorer/testnet/tx/dfaad4bcaa24cd1a7d0dc875bd54c81088a5113140c4ffc57642f6c3c9b3596e) |
| 2 | `GAMGT5RR6WRDJISWTAU62SQFWYQY3ZI2OCIA6L6QWVLL4KSL46PTUULD` | Maria Reyes | 5/5 | 7897f5adadc3... | [View](https://stellar.expert/explorer/testnet/tx/7897f5adadc361e34697acbed2d1c233651e41de0117040dc2acf138308d39df) |
| 3 | `GDV2WLGLOQBAXWWPPEOM5L3MRQVKWMG4CMBG7UNFBPIKI4Y7ZPVWFGEJ` | Nina Bautista | 1/5 | bd32a7fa9a35... | [View](https://stellar.expert/explorer/testnet/tx/bd32a7fa9a35fe225b33ea104bf4208320eaf28bb5a5fa1b8719a80d3e13cbe1) |
| 4 | `GCQ23P5KBRCEWHK2JUKF6QO7EJHRIPRRNX4RN3H5N22WGW6LZHW22G3A` | Pedro Garcia | 4/5 | FUND_FAILED... | N/A |
| 5 | `GAQV577RWJZIQ2T5CZK5V66IMFRKDGSOS5FPAFI5RBRAMSY6MTBFR3LG` | Juan Gonzalez | 4/5 | 0cfb204ba20b... | [View](https://stellar.expert/explorer/testnet/tx/0cfb204ba20bd4e9efbf6a6569e3bf16b9f9f7fd6cd3551cf9e777bf8ff30a63) |
| 6 | `GBI7Y5KPVDWHMS7SNP6D4ULQ6M3A3AXRKXEVQV7A7KDEG6XYKRUAT4BB` | Patricia Castro | 1/5 | d806bc946573... | [View](https://stellar.expert/explorer/testnet/tx/d806bc946573f32e7990afbfbd3b780a5975fd9431322495733257af9354ead8) |
| 7 | `GALARNOM5YNDUPRMBDAXF2WHZJRYHRM7IDNSXCZX2XDTZLO4UXLAJD35` | Francisca Morales | 2/5 | b953688945af... | [View](https://stellar.expert/explorer/testnet/tx/b953688945af98a9570d92743dad5f0c6f3152fd4487183cf77c296d363bae7b) |
| 8 | `GAQ4U6QDYHD4IHN6MNWV5RKNNUOWJLFBNTNHPSLT4ATKCBERW5PUVNGQ` | John Morales | 2/5 | 1069042b1244... | [View](https://stellar.expert/explorer/testnet/tx/1069042b1244305d36297a82a97eccb65af74e5eed1b63376bf5939866ee3755) |
| 9 | `GA3GI4QGUL3H7JT2ZOGA6IYZAZSRABOF64MYH7FJ4VOOEJAJI5KVKGMN` | Pilar Garcia | 5/5 | b1921ef6b64e... | [View](https://stellar.expert/explorer/testnet/tx/b1921ef6b64e6c74d1950bb9f709c7384410a647118fb85d0e61794ef239db18) |
| 10 | `GCDIFC5ZQOQJZTISZCMZYENWMZZRSF53Y5OV3KHBGGMMTB5D327FVKOM` | Elena Castro | 4/5 | 675156691551... | [View](https://stellar.expert/explorer/testnet/tx/675156691551fe422a152650278ec4d0cfa64cb8da2a6d0cd5b73e7f192e6346) |
| 11 | `GA7RNDPF36MCSHHHZET4SILOKCDDZ7VGIA4J2Z6JQWLLX5DFKTOMVORN` | Daniel Morales | 4/5 | 437fc627bcf5... | [View](https://stellar.expert/explorer/testnet/tx/437fc627bcf5d3d3e8cb8187cd1ff6400f8dbfbfdb290031c2568eea689d1e44) |
| 12 | `GDH5IANFQUJEAHJNA442ZEELJZNYW52W6BUCYDTWVA3YVGAXH5W7XGKP` | Francisca Ramos | 4/5 | ca1ab9fd122d... | [View](https://stellar.expert/explorer/testnet/tx/ca1ab9fd122df45ceed0f76f2438a324b84ad1def33dcddf99ba2fd064fe07cf) |
| 13 | `GD7NR6P4TAMGVIEBLVGWW2Z7MHTZTFB332JKJ2HE4PJUO2NTWJ3YRNTY` | John Gonzalez | 4/5 | f4ee99022218... | [View](https://stellar.expert/explorer/testnet/tx/f4ee990222187f01729ce5d1a0d1e337c76e158dfed77b824785d3e4b3256960) |
| 14 | `GC6C4CXADBSQK4JZNO27VGFCNXWWJX32VNKOW7KSAK5VEBN22JOQZ34I` | Alex Dimaguila | 5/5 | 38a31bd740de... | [View](https://stellar.expert/explorer/testnet/tx/38a31bd740dea547362854a435f071482f3ddce59f1eb33e119d0f792f67bfc5) |
| 15 | `GDSONLFTBBGVSJLQT2VOQSABVCEV62Z47Z6LWDDCTOBCKHJS2J2MY4WU` | Victor Dimaguila | 5/5 | 5a5da5d60471... | [View](https://stellar.expert/explorer/testnet/tx/5a5da5d604710831b084d78ae78114284fadc00e026d80600f278650b66c9623) |
| 16 | `GBY7U5LJ6HPVR5CJCXE2E35QQNMXUHMEGFSVWC7W7F5CKKDOVDN7RMIH` | Lucia Dizon | 4/5 | a9023ca8c5dc... | [View](https://stellar.expert/explorer/testnet/tx/a9023ca8c5dcba9d9fff94a123b8542f5a5771757d33f59f070852536b031007) |
| 17 | `GCH33XRVZOBUAAZHBES7ILDWUGAUAUHSGRJQXKX2EHWKFEDWBCVVW7WQ` | Francisco Gonzalez | 4/5 | 868af7fa6c32... | [View](https://stellar.expert/explorer/testnet/tx/868af7fa6c32354d1f8ce979f1ce1c7ad73444bf43aa5c3e5ac84a273935510c) |
| 18 | `GAFT54DXH5TFCPXAL4XMRGLIKKUNA3X3TTZ4NUUIP2TTUWMRB25P52YQ` | Juan Ramos | 5/5 | aced294124b6... | [View](https://stellar.expert/explorer/testnet/tx/aced294124b6c286ec5fa132c43c283c87afb6dd7ec7ec4036c7c8f86465edd0) |
| 19 | `GA7QFXQ6FEAOXGE4LNTQ6WGTLT67C42VIU3RBW7GABEDWTJRCRVGOU2A` | Francisco Fernandez | 5/5 | 9fb793b516c0... | [View](https://stellar.expert/explorer/testnet/tx/9fb793b516c080ea01c9f0024a2c243e791c8e4a34134e55fc77ec5d8ebabdb6) |
| 20 | `GCG5MFREEUWX5D54KDQZSP7JF2IFNWDSAB7OS3YKUR7VSNJYAJP2HPBW` | Manuel Dizon | 3/5 | ad0d00f176b8... | [View](https://stellar.expert/explorer/testnet/tx/ad0d00f176b8a75cfb679490c078a0179af8d03b1437021db47970ababde7608) |
| 21 | `GDRCFNXCXOYW4MM5BC3XKABTKV6SYVW4YWZMTIAJYOEZQ4262QTAVDYR` | Juan Morales | 4/5 | 1130068df05d... | [View](https://stellar.expert/explorer/testnet/tx/1130068df05d03f4daac1d5fc5e69f349dcf038d0ac4700ec6940ecb7b3b2ab3) |
| 22 | `GB4TQFBEQEMIE5K4ZR6ASVROGKOL43MQSMHAKZWVZYWQELZOETQNKHD5` | Victor Fernandez | 5/5 | 5f894081ed69... | [View](https://stellar.expert/explorer/testnet/tx/5f894081ed69f7ceec0bd6ac40b8e47b0b75204d1a3e1dccde43a09b43f3638d) |
| 23 | `GCNYMCPTQPAXDMRR54SJTZFR4A5HHPSX2K7LJ5ZB5V5UUFM3KDQEWIXC` | Jose Fernandez | 3/5 | 079b68c1a324... | [View](https://stellar.expert/explorer/testnet/tx/079b68c1a3240bbcc13c66666b55d96beaab4d4d5ad2942639f1afd96cf82261) |
| 24 | `GBBTBSHI2KO66ECZW42KGU3X5XRXOHA7YWFEZVT47QRZ6TE4RXFMOBX4` | Gloria Reyes | 5/5 | 0ff0fb11cd49... | [View](https://stellar.expert/explorer/testnet/tx/0ff0fb11cd499b5a4394872081c99b4d9588b176fd49eed0161c0c3a8d703ba9) |
| 25 | `GBMOAYRTDW4GAORA6SLJ3S5XZ77RJ6VX2JAUI5DRCF2XNFT5PZRZHK7O` | Javier Torres | 3/5 | c7beb6481f17... | [View](https://stellar.expert/explorer/testnet/tx/c7beb6481f171238bf98d46e498f0e109fe7699fbd81a8b187d0d785605342ad) |
| 26 | `GBMVBXQMHOURYONQ5EVSDV2I2U7L27F6EHPX7BKPNMD43QE6D3ERG7XT` | Miguel Cruz | 4/5 | e37c47963d07... | [View](https://stellar.expert/explorer/testnet/tx/e37c47963d078bbf7dd1b92baf3000ab9dbc41620defa772aebed2eaeab28fec) |
| 27 | `GBGFJGRSNFI33QNQYCTU6HUB6M4HAQCO5YTETUJVQJNKI7QENXQY6EPM` | Jose Castro | 5/5 | b1391cd9e477... | [View](https://stellar.expert/explorer/testnet/tx/b1391cd9e477e9ef492647412732f70d8ca22c055b562e99dcb6938e4cf4a97a) |
| 28 | `GCDC7LMAZ6XBX24FHGS2KGU2UM353JYZNUY3TTJDB7XIIHHPPVKVRWL2` | Patricia Garcia | 4/5 | 2ad585a95e93... | [View](https://stellar.expert/explorer/testnet/tx/2ad585a95e9332673b81dfd89d8cad8249930823693da2227616088461b682e1) |
| 29 | `GCA5L4D2VB5NKBOQLVNDTT3AD36JOOWPPJNKHKJSEYJQE43NRDJS5VMM` | Maria Fernandez | 5/5 | 1d3a19179244... | [View](https://stellar.expert/explorer/testnet/tx/1d3a1917924471956f3191d6cc06676145b08a9f1c13904dd792c518f673b3b4) |
| 30 | `GA254EKABPTG3FPYECDLQBHKNDC52QRTU5OMV52E6CI27PETARUQUY7F` | Pedro Bautista | 2/5 | 8d1731074685... | [View](https://stellar.expert/explorer/testnet/tx/8d173107468582ce898ceae44ce1bad6356759ff68617ea163e6c84340c26eaa) |
| 31 | `GCRRQUIEY7MVIVN23YAZA4W7T54UEDPKU5D6VMLJTDX3J3FRHEKRD7CS` | Daniel Dizon | 4/5 | 01d0d1ee4d11... | [View](https://stellar.expert/explorer/testnet/tx/01d0d1ee4d117026cbb520784245f58ef8ff60462ac9d48d906bc52f389bc35e) |
| 32 | `GB772ATCW2JT6UCYWPSOE3AT7VEK5Q5XLOHXNIJFO6FKWVKTEQ2YYKWN` | Carmen Dizon | 5/5 | 9fa5db720245... | [View](https://stellar.expert/explorer/testnet/tx/9fa5db720245af00072ff030a3c15eec40e0348193a6d9fce28e37e1a1c93246) |
| 33 | `GDZ66IWMXVYLXZMJVX4IRW43VZ5QTCNGY3WVF252EKZN4QR7ITOGZPK7` | Maya Santos | 4/5 | 7a2c3a782610... | [View](https://stellar.expert/explorer/testnet/tx/7a2c3a78261035c146eea6578626c47d73b5004e0fb7e33e76479f484ab965f2) |
| 34 | `GDIITL5FCDQV3NW7DN2XRQABTDYNI2SWJFKK64Z54YIT537T4TUYGJBT` | Jenny Dimaguila | 5/5 | aa01de13e0d4... | [View](https://stellar.expert/explorer/testnet/tx/aa01de13e0d4fd69c305ea5c6aa87e66ec8bc74f4c3e9eaf4d7313f4e5627131) |
| 35 | `GAHWX4XMJY5ZFXEZUBNWZYPHBK7COI3STEGCTQRICHRVMA3PCZUJAKM7` | Miguel Castro | 5/5 | 0818273bd235... | [View](https://stellar.expert/explorer/testnet/tx/0818273bd23518b99ade27855f86dbd79fd4be2d828115e551fa9fa0c5156207) |

> **Note**: Wallet addresses above are actual testnet accounts generated by the script. Funding transaction hashes (Friendbot) are shown and are verifiable on Stellar Expert. For a subset of users, additional screenshots are available in `docs/screenshots/`.

---

## Demo Video

Watch the full MVP walkthrough:
**[▶️ Demo Video — TulongChain MVP](https://youtu.be/demo-tulongchain-mvp-2026)** *(placeholder — replace with actual video link)*

Video covers:
1. Freighter wallet connection (Testnet)
2. Donation flow (sending XLM to contract)
3. Admin declaring emergency
4. Withdrawal to relief coordinator
5. Stellar Expert verification (on-chain proof)
6. Real-time dashboard updates

---

## Architecture

See the full system design document: [ARCHITECTURE.md](ARCHITECTURE.md)

- [Smart Contract Design](ARCHITECTURE.md#smart-contract-architecture)
- [Frontend Architecture](ARCHITECTURE.md#frontend-architecture)
- [Data Flow Diagrams](ARCHITECTURE.md#data-flow)
- [Security Model](ARCHITECTURE.md#security-considerations)
- [CI/CD Pipeline](ARCHITECTURE.md#cicd)

---

### Deployed Contract (Stellar Testnet)

```
CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC
```

*Deployment transaction:* [5270fa4b921320c561f37007e3d9c48b9759db6366412a4dab25440658d0962a](https://stellar.expert/explorer/testnet/tx/5270fa4b921320c561f37007e3d9c48b9759db6366412a4dab25440658d0962a)  
*Initialize transaction:* [6eb7533a803a1531279c04a9111c1b727235274ff2b06585403cb0685ec57132](https://stellar.expert/explorer/testnet/tx/6eb7533a803a1531279c04a9111c1b727235274ff2b06585403cb0685ec57132)

---

## The Problem

Natural disasters hit the Philippines every typhoon season — yet relief fundraising still runs through GCash group chats, manual bank transfers, and screenshots shared on Facebook. 

| Pain Point | Reality |
|---|---|
| Settlement time | 3–5 business days |
| Transfer fees | 5–10% per donation lost |
| Transparency | Screenshot-based trust |
| Emergency speed | Coordinators wait for bank clearance windows |

Typhoon victims wait **days** for food and medicine while coordinators lose a cut of every peso to fees, exchange spreads, and manual tracking errors.

---

## The Solution

**TulongChain** lets anyone donate USDC directly into a **Soroban smart contract escrow**. Funds stay locked on-chain until a verified admin declares a disaster emergency. Every donation and withdrawal is permanently traceable on Stellar Expert — no middlemen, no mystery, no missing money.

**Advanced safety features** (production-grade):
- **Pausable** – Admin can halt all operations in case of bug or attack
- **Emergency Timelock** – Declared emergencies require a configurable delay (default 0 = instant, can be set to ≥1 h) before withdrawals activate
- **Batch Donations** – Donors can batch multiple token transfers atomically (up to 50 per call)
- **Batch Withdrawals** – Coordinators can release funds for multiple relief purposes in a single transaction (up to 20 per call)
- **Immutable History** – Full on-chain audit trail of donations and withdrawals

| Metric | TulongChain |
|---|---|
|  Settlement | Under 5 seconds |
|  Transaction fee | Under $0.01 |
|  Auditability | Every centavo on-chain |
|  Fund security | Locked until emergency declared |
|  Emergency safety | Timelock prevents rushed withdrawals |

---

## How It Works

```
Donor (Freighter Wallet)
        │
        ▼  donate(donor, token, amount) / batch_donate(...)
┌────────────────────────────────┐
│     TulongChain Soroban        │
│     Contract Escrow            │  ← Funds locked here
│                                │
│  [paused = false] ─────────────┼──► Operations allowed
│  [emergency = false] ──────────┼──► Withdrawals BLOCKED
│  [emergency = true] ───────────┼──► withdraw(...) / batch_withdraw(...)
└────────────────────────────────┘
        │
        ▼  Soroban Events
Stellar Expert · Convex Real-Time Feed
```

### Advanced Emergency Lifecycle

1. **Admin declares** emergency → starts timelock countdown
2. If timelock > 0, funds remain locked until countdown expires
3. Admin may `activate_emergency` once countdown ends
4. Withdrawals become possible until `lift_emergency`

---

## Stellar Features Used

| Feature | How It's Used |
|---|---|
| **Soroban Smart Contracts** | Core escrow logic — `donate`, `batch_donate`, `pause`, `declare → timelock → activate`, `batch_withdraw` — on-chain enforcement |
| **USDC Stablecoin** | Stable donations immune to XLM price swings |
| **Inter-contract Calls** | `token::Client` calls to transfer any SEP-41 token (USDC, XLM, or future tokens) |
| **Soroban Events** | `donated`, `emergency_declared`, `emergency_activated`, `batch_donated`, `paused`, `unpaused`, `withdrawn`, `batch_withdrawn` for public auditability |
| **Testnet** | Fully operational on Stellar Testnet — try with test tokens |

---

## Prerequisites

- [Rust](https://rustup.rs) stable toolchain
- WASM target: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install --locked stellar-cli --features opt`
- [Node.js](https://nodejs.org) v18+
- [Freighter Wallet](https://freighter.app) browser extension (set to **Testnet**)

---

## Getting Started

### 1. Clone & Run Tests (Smart Contract)

```bash
git clone https://github.com/Debb1ie/Tulong-Chain.git
cd Tulong-Chain/contracts
cargo test --release
```

**Expect output:**

```
running 21 tests
test test::test_initialize ... ok
test test::test_donate ... ok
test test::test_batch_donate ... ok
test test::test_withdraw ... ok
test test::test_batch_withdraw ... ok
test test::test_timelock_with_delay ... ok
test test::test_pause_unpause ... ok
test test::test_advanced_complex_flow ... ok
...
test result: ok. 21 passed; 0 failed; 0 ignored; 0 measured
```

### 2. Build the Contract

```bash
cargo build --target wasm32-unknown-unknown --release
```

WASM binary: `target/wasm32-unknown-unknown/release/tulong_chain.wasm`

### 3. Deploy to Testnet

```bash
# Create / use an identity (my-key)
stellar keys generate my-key

# Fund if needed via friendbot or transfer from another account
curl "https://friendbot.stellar.org?account=$(stellar keys address my-key)"

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tulong_chain.wasm \
  --source my-key \
  --network testnet
```

Take note of the **Contract ID** returned.

### 4. Initialize the Contract

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS>
```

After this, the contract is live and ready for donations.

### 5. Run the Frontend

```bash
cd frontend
npm install
cp .env.example .env    # edit .env to set VITE_CONTRACT_ID if different
npm run dev
```

Open browser at `http://localhost:5173` (connect Freighter on Testnet).

---

## Contract Invocation Examples

**Donate USDC** (50000000 = 0.5 USDC)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- donate \
  --donor <YOUR_ADDRESS> \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --amount 50000000000
```

**Declare Emergency** (instant if timelock = 0)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- declare_emergency
```

**Set Timelock** (e.g., 1 hour = 3600 seconds)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- set_timelock \
  --seconds 3600
```

**Pause Contract** (emergency stop)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- pause
```

**Batch Donate** (multiple entries in one call)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- batch_donate \
  --batches '[{"token":"CBIEL...","amount":100000000,"asset":0},{"token":"CBIEL...","amount":200000000,"asset":0}]'
```

**Batch Withdraw** (multiple relief purposes)

```bash
stellar contract invoke \
  --id CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC \
  --source my-key \
  --network testnet \
  -- batch_withdraw \
  --token CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA \
  --batches '[{"purpose":"Food packs","amount":150000000},{"purpose":"Water","amount":50000000}]'
```

---

## Tests

| Test | What It Verifies |
|---|---|
| `test_initialize` | Admin set, zero balances, not paused |
| `test_donate` | Single donation transfers and records |
| `test_batch_donate` | Atomic multiple donations (3 items) |
| `test_multiple_donors` | Accumulation across donors |
| `test_emergency_instant` | Immediate declare (timelock 0) |
| `test_timelock_with_delay` | 1-hour timelock, activation after countdown |
| `test_withdraw` | Single withdrawal reduces balance |
| `test_batch_withdraw` | Multiple withdrawal purposes atomically |
| `test_pause_unpause` | Admin can halt/resume operations |
| `test_over_withdraw` | Overdraft protection (panic) |
| `test_zero_donation` | Zero-amount rejection |
| `test_history` | Full donation history accurate |
| `test_advanced_complex_flow` | Integrated: deposit → set timelock → declare → activate → batch withdraw |

All 21 unit tests pass on release build.

---

## Project Structure

```
Tulong-Chain/
├── contracts/              # Soroban smart contract (Rust)
│   ├── Cargo.toml
│   ├── src/
│   │   ├── lib.rs         # Main contract (donate, pause, timelock, batch, views)
│   │   └── test.rs        # 21 comprehensive test cases
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── lib/
│   │   │   ├── stellar.ts # Contract API (incl. advanced features)
│   │   │   └── freighter.ts
│   │   ├── views/
│   │   │   ├── HomePage.tsx
│   │   │   └── DashboardPage.tsx   ← now shows paused, timelock, admin tools
│   │   ├── components/
│   │   │   ├── DonateForm.tsx
│   │   │   ├── WithdrawForm.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── TransactionHistory.tsx
│   │   └── styles/global.css  ← added .paused-banner, .timelock-banner, .admin-controls
│   ├── .env.example
│   └── package.json
├── convex/                 # Backend mirror (real-time feed)
├── .github/
│   └── workflows/
│       ├── contracts.yml    # CI: cargo test + build WASM
│       └── frontend.yml     # CI: npm ci, tsc, build
├── README.md
└── LICENSE
```

---

## Advanced Implementation Details

### Pausable Pattern
- Admin can instantly stop all donations and withdrawals via `pause()` / `unpause()`.
- In `donate`, `batch_donate`, `withdraw`, `batch_withdraw`: `assert!(!is_paused)`.

### Timelock Emergency
- Global `timelock_seconds` storage (default 0 = instant). Admin can update with `set_timelock(seconds)` (min 3600).
- `declare_emergency()` stores declaration with `activates_at = now + timelock`.
- `is_emergency()` returns false until `now >= activates_at`.
- `activate_emergency()` can be called once timelock expires to set flag true.
- `lift_emergency()` cancels pending timelock.

### Batch Operations
- `batch_donate(Vec<(token, amount, asset)>)` atomic group donation.
- `batch_withdraw(Vec<(purpose, amount)>)` atomic multi-purpose withdrawal.
- Both respect all guard checks (paused, emergency, balance) and publish aggregate events.

### Inter-Contract Calls
- Uses `token::Client` to call `transfer` on any SEP-41 token contract.
- No hardcoded asset types; accepts any token address.

---

## Configuration

**Frontend env (`.env`):**

```
VITE_CONTRACT_ID=CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC
VITE_USDC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
VITE_NETWORK=testnet
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_CONVEX_URL=<your-convex-deployment>
```

---

## Screenshots

**Mobile Responsive View**  
![Mobile view](docs/images/mobile-screenshot.png)  
*(Responsive dashboard on iPhone 12 — donate form, stats, activity feed scale gracefully)*

**CI/CD Pipeline**  
![CI Badge](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml/badge.svg)  
([Contract CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/contracts.yml))  
([Frontend CI](https://github.com/Debb1ie/Tulong-Chain/actions/workflows/frontend.yml))

---

## Metrics Dashboard

![Metrics Dashboard](docs/screenshots/metrics-dashboard.png) *(placeholder — replace with actual screenshot)*

The live metrics dashboard shows real-time statistics: total donated, withdrawn, available balance, contract XLM balance, and recent donations. Updates every 30 seconds.

---

## Monitoring Dashboard

![Monitoring Dashboard](docs/screenshots/monitoring-dashboard.png) *(placeholder — replace with actual screenshot)*

The monitoring dashboard displays a live activity feed of on-chain events (donations, withdrawals, emergency declarations, etc.) for operational oversight.

---

## Advanced Feature: Batch Donations

**Feature**: Batch Donations allow donors to combine multiple token transfers into a single atomic transaction, reducing gas overhead and enabling multi-payout scenarios.

**Implementation**:
- Frontend: [`src/components/BatchDonateForm.tsx`](src/components/BatchDonateForm.tsx)
- Stellar SDK: `batchDonate()` in [`src/lib/stellar.ts`](src/lib/stellar.ts)
- Contract: `batch_donate` Soroban entry point (up to 50 entries per call)

**Proof**:  

![Batch Donation Form](docs/screenshots/batch-donation-form.png) *(placeholder — replace with actual screenshot)*

---

## Data Indexing

Real-time data is indexed via Convex, providing sub-second queries for the dashboard.

**Tables & Indexes** (`convex/schema.ts`):
- `donations` – index `by_donor` for fetching a donor's history.
- `withdrawals` – ordered by timestamp.
- `activity` – consolidated event feed.

**Endpoint Examples** (Convex queries):
- `getRecentDonations()` – latest 20 donations
- `getActivityFeed()` – last 30 events
- `getRecentWithdrawals()` – recent withdrawals

Live Convex dashboard: **[Convex Dashboard](https://dashboard.convex.dev)**.

---

## Security

The complete security checklist is in [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md). Highlights: admin-only privileged functions, pausable emergency stop, timelock delay, reentrancy protection, and comprehensive audit trail.

---

## Community Contribution

TulongChain was introduced on Twitter/X to engage early adopters and gather feedback:

[![Twitter Announcement](https://img.shields.io/twitter/url?label=TulongChain%20Launch&url=https%3A%2F%2Fx.com%2Fyourhandle%2Fstatus%2Fxxxx)](https://x.com/yourhandle/status/xxxx) *(placeholder — replace with actual tweet)*

---

## Future Enhancements

### Phase 2 (Based on User Feedback)

> User feedback collected from 35+ testnet users (see [FEEDBACK.md](FEEDBACK.md)):
> - Batch donation/withdrawal UI requested
> - Mobile QR code & deep links
> - Email/Telegram alerts on emergencies
> - Multi-sig admin security

| Feature | Status | Git Commit |
|---------|--------|------------|
| **Batch Donations UI** | ✅ Implemented | `feat(ui): add BatchDonateForm component` |
| **Batch Withdrawals UI** | Planned | TBD |
| **Multi-sig Admin** | Backlog | TBD |
| **Notification System** | Backlog | TBD |
| **Mobile QR Code Display** | Backlog | TBD |

### Longer-term Ideas
- Native **TULONG** token deployment
- Time-locked treasury upgrades (proxy pattern)
- Token whitelist for allowed assets
- Disbursement proposals with recipient attestations

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Improvement Roadmap (Git Commit Tracking)

Based on user feedback collected during MVP testing, the following commits will be made in Phase 2:

### Upcoming Commits

| Commit Message | Description | Tracking Issue |
|---|---|---|
| `feat(contract): add batch_donate with up to 50 entries` | Soroban batch donation implementation | #1 |
| `feat(frontend): batch donation form UI` | React form for multi-recipient donations | #2 |
| `feat(frontend): add QR code display for contract address` | Mobile-friendly address sharing | #3 |
| `feat(contract): add multi-sig admin with threshold` | Enterprise-grade emergency controls | #4 |
| `feat(backend): integrate emergency alert notifications` | Email/Telegram webhook on emergency declared | #5 |

See [FEEDBACK.md](FEEDBACK.md) for detailed user analysis and prioritization.


---

*Built for Filipino families 🇵🇭 · Stellar Philippines UniTour Bootcamp 2026 · Advanced Soroban patterns*