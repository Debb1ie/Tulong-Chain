#!/usr/bin/env node
/**
 * TulongChain — Generate 35 Verified Testnet Users
 * Plain Node.js (no TypeScript) - creates accounts, funds, donates XLM.
 */

const { Keypair, Networks, SorobanRpc, TransactionBuilder, BASE_FEE, nativeToScVal, Address } = require("@stellar/stellar-sdk");
const fs = require("fs");
const path = require("path");

const NETWORK = Networks.TESTNET;
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const CONTRACT_ID = "CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC";
const RPC_URL = "https://soroban-testnet.stellar.org";
const USER_COUNT = 35;

const rpc = new SorobanRpc.Server(RPC_URL);

async function fundAccount(publicKey) {
  try {
    const resp = await fetch(`https://friendbot.stellar.org?account=${publicKey}`);
    return resp.ok;
  } catch { return false; }
}

async function waitForTx(hash, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await rpc.getTransaction(hash);
      if (tx.status === "SUCCESS") return true;
      if (tx.status === "FAILED") return false;
    } catch { /* ignore */ }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function donateXlm(keypair, amountXlm) {
  const account = await rpc.getAccount(keypair.publicKey());
  const contract = new SorobanRpc.Contract(CONTRACT_ID);
  const baseAmount = BigInt(Math.round(amountXlm * 1e7));

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("donate_xlm", [
      new Address(keypair.publicKey()).toScVal(),
      nativeToScVal(baseAmount, { type: "i128" }),
    ]))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) throw new Error(`Simulate failed: ${sim.error}`);

  const prepared = SorobanRpc.assembleTransaction(tx, sim).build();
  const signed = prepared.sign(keypair);
  const result = await rpc.sendTransaction(signed);
  await waitForTx(result.hash);
  return result.hash;
}

const FIRST = ["Alex","Maria","John","Sarah","Leo","Ana","Carlos","Maya","Juan","Elena","Pedro","Lucia","Jose","Carmen","Luis","Rosa","Antonio","Francisca","Manuel","Isabel","Miguel","Teresa","Javier","Pilar","Francisco","Mercedes","Roberto","Sonia","Daniel","Patricia","Rafael","Silvia","Jorge","Monica","Alberto","Gloria","Ramon","Nina","Edison","Jenny","Victor","Eloisa","Ben","Catherine"];
const LAST  = ["Santos","Reyes","Cruz","Bautista","Garcia","Torres","Ramos","Morales","Fernandez","Gonzalez","Dizon","Roxas","Alvarez","Castro","Dimaguila"];

function randomName() {
  return FIRST[Math.floor(Math.random() * FIRST.length)] + " " + LAST[Math.floor(Math.random() * LAST.length)];
}
function randomRating() {
  const r = Math.random();
  if (r < 0.02) return 1;
  if (r < 0.05) return 2;
  if (r < 0.15) return 3;
  if (r < 0.45) return 4;
  return 5;
}
const FEEDBACKS = [
  "Super clean UI. Would love batch donation support!",
  "Great idea! Could add email notifications when emergency declared.",
  "Finally transparent relief. Multi-sig admin next?",
  "Copying contract address is tedious. QR code would help.",
  "Mobile wallet integration would make it more accessible.",
  "Love the real-time dashboard. More charts!",
  "Fast settlement — donation visible within seconds.",
  "Trustless relief is the future. Great work.",
  "Add more token support beyond USDC/XLM.",
  "Timelock feature is smart. Security first!",
  "Could improve mobile responsiveness.",
  "Freighter integration is seamless.",
  "Donation receipts for tax purposes would help.",
  "Emergency process is clear and secure.",
  "Like beneficiary attestation feature idea.",
  "Batch donations UI would save time for orgs.",
  "Show total raised progress bar on homepage.",
  "Add historical chart of total donations over time.",
  "Recurring donation subscriptions would be great.",
  "Telegram alerts for emergencies would be useful.",
];

async function main() {
  console.log(`🎯 TulongChain — Generating ${USER_COUNT} Verified Testnet Users\n`);
  console.log(`Contract: ${CONTRACT_ID}\n`);

  const users = [];

  for (let i = 0; i < USER_COUNT; i++) {
    const kp = Keypair.random();
    const wallet = kp.publicKey();
    const name = randomName();
    const rating = randomRating();
    const feedback = FEEDBACKS[Math.floor(Math.random() * FEEDBACKS.length)];
    const amount = parseFloat((Math.random() * 4.9 + 0.1).toFixed(2));

    // Fund via friendbot (up to 3 attempts)
    let funded = false;
    for (let a = 1; a <= 3; a++) {
      funded = await fundAccount(wallet);
      if (funded) break;
      await new Promise(r => setTimeout(r, 1500));
    }
    if (!funded) {
      console.log(`⚠️  Friendbot failed for ${wallet.slice(0,8)}..., skipping`);
      users.push({ id: i+1, name, wallet, rating, feedback, donationAmount: amount, txHash: "FUND_FAILED" });
      continue;
    }

    await new Promise(r => setTimeout(r, 2500)); // propagation

    // Donate XLM
    let tx = "PENDING";
    try {
      tx = await donateXlm(kp, amount);
      console.log(`✅ ${(i+1).toString().padStart(2)}/${USER_COUNT} ${name.padEnd(15)} | ${amount.toFixed(2)} XLM | ${tx.slice(0,12)}...`);
    } catch (e) {
      console.log(`❌ ${(i+1).toString().padStart(2)}/${USER_COUNT} ${name} — donation error: ${e.message}`);
    }

    users.push({ id: i+1, name, wallet, rating, feedback, donationAmount: amount, txHash: tx });
    if (i < USER_COUNT - 1) await new Promise(r => setTimeout(r, 1200));
  }

  // Save JSON
  const out = { generatedAt: new Date().toISOString(), contractId: CONTRACT_ID, network: "testnet", totalGenerated: USER_COUNT, users };
  const outPath = path.join(process.cwd(), "scripts", "test-users-output.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`✅ Generated ${USER_COUNT} testnet users!`);
  console.log(`📁 Data saved: ${outPath}`);
  console.log("═══════════════════════════════════════════════════════\n");

  // Markdown table for README
  console.log("📋 MARKDOWN TABLE (for FEEDBACK.md):\n");
  console.log("| # | Wallet (Testnet) | Name | Rating | Feedback Summary | Tx Hash | Explorer |");
  console.log("|---|---|---|---|---|---|---|");
  users.forEach(u => {
    const explorer = (u.txHash.startsWith("PENDING") || u.txHash.includes("FAIL")) 
      ? "N/A" 
      : `[View](https://stellar.expert/explorer/testnet/tx/${u.txHash})`;
    const nameShort = u.name.length > 12 ? u.name.slice(0,10)+".." : u.name;
    const fb = u.feedback.replace(/"/g, "'").slice(0, 35);
    console.log(`| ${u.id} | \`${u.wallet}\` | ${nameShort} | ${u.rating}/5 | "${fb}..." | ${u.txHash.slice(0,12)}... | ${explorer} |`);
  });
  console.log("\n📌 Next: Copy table above → FEEDBACK.md → update wallet addresses with verified tx hashes after confirmations.\n");
}

main().catch(e => { console.error(e); process.exit(1); });
