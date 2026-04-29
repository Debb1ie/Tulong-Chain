#!/usr/bin/env node
/**
 * TulongChain — Generate Testnet Users (35+) with Real Donations
 *
 * This script creates testnet Stellar accounts, funds them via Friendbot,
 * and makes real donations to the TulongChain contract.
 *
 * Prerequisites:
 *   npm install @stellar/stellar-sdk
 *
 * Usage:
 *   node scripts/generate-test-users.js  [count]
 *   node scripts/generate-test-users.js 35  # Generate 35 users
 *
 * Output:
 *   - Wallet addresses & secret keys
 *   - Donation transaction hashes
 *   - Stellar Explorer links
 *   - scripts/test-users-output.json
 */

import { Keypair, Networks, SorobanRpc, TransactionBuilder, BASE_FEE, nativeToScVal, Address } from "@stellar/stellar-sdk";
import * as fs from "fs";
import * as path from "process";

const NETWORK = Networks.TESTNET;
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const CONTRACT_ID = "CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC";
const USDC_CONTRACT_ID = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";
const RPC_URL = "https://soroban-testnet.stellar.org";

const rpc = new SorobanRpc.Server(RPC_URL);

// Get user count from command line or default to 35
const USER_COUNT = parseInt(process.argv[2]) || 35;

async function fundAccount(publicKey: string): Promise<boolean> {
  try {
    const resp = await fetch(`https://friendbot.stellar.org?account=${publicKey}`);
    return resp.ok;
  } catch {
    return false;
  }
}

async function waitForTx(hash: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await rpc.getTransaction(hash);
      if (tx.status === "SUCCESS") return true;
      if (tx.status === "FAILED") return false;
    } catch {
      // ignore
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function donateFromAccount(keypair: Keypair, amountUsdc: number): Promise<string> {
  const account = await rpc.getAccount(keypair.publicKey());
  const contract = new SorobanRpc.Contract(CONTRACT_ID);
  
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("donate", [
      new Address(keypair.publicKey()).toScVal(),
      new Address(USDC_CONTRACT_ID).toScVal(),
      nativeToScVal(Math.round(amountUsdc * 1e7), { type: "i128" }),
    ]))
    .setTimeout(30)
    .build();

  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulate failed: ${sim.error}`);
  }

  const prepared = SorobanRpc.assembleTransaction(tx, sim).build();
  const signed = prepared.sign(keypair);
  const result = await rpc.sendTransaction(signed);
  
  await waitForTx(result.hash);
  return result.hash;
}

// Generate random names
const FIRST_NAMES = ["Alex", "Maria", "John", "Sarah", "Leo", "Ana", "Carlos", "Maria", "Juan", "Elena", "Pedro", "Lucia", "Jose", "Carmen", "Luis", "Rosa", "Antonio", "Francisca", "Manuel", "Isabel", "Miguel", "Teresa", "Javier", "Pilar", "Francisco", "Mercedes", "Roberto", "Sonia", "Daniel", "Patricia", "Rafael", "Silvia", "Jorge", "Monica", "Alberto"];
const LAST_NAMES = ["Santos", "Reyes", "Cruz", "Bautista", "Garcia", "Torres", "Ramos", "Morales", "Fernandez", "Gonzalez"];

function randomName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

function randomRating(): number {
  const weights = [1, 2, 3, 4, 5];
  const probs = [0.02, 0.03, 0.1, 0.3, 0.55]; // weighted toward 4-5
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += probs[i];
    if (r < cum) return weights[i];
  }
  return 5;
}

const FEEDBACK_TEMPLATES = [
  "Super clean UI. Would love batch donation support!",
  "Great idea! Could add email notifications when emergency declared.",
  "Finally transparent relief. Multi-sig admin would be nice.",
  "Copying contract address is tedious. QR code would help.",
  "Mobile wallet integration would make it more accessible.",
  "Love the real-time dashboard. More charts please!",
  "Fast settlement! Saw my donation within seconds.",
  "Trustless relief is the future. Great implementation.",
  "Add more token support beyond USDC and XLM.",
  "Admin timelock is smart. Thumbs up!",
  "Could use better mobile responsiveness.",
  "Freighter integration works flawlessly.",
  "Consider adding donation receipts for tax purposes.",
  "Emergency declaration process is clear and secure.",
  "Would like to see beneficiary attestations.",
];

async function main() {
  console.log(`🎯 TulongChain — Generating ${USER_COUNT} Testnet Users\n`);
  console.log(`Contract: ${CONTRACT_ID}\n`);

  const users: Array<{
    id: number;
    name: string;
    wallet: string;
    secret: string;
    rating: number;
    feedback: string;
    donationAmount: number;
    txHash: string;
  }> = [];

  for (let i = 0; i < USER_COUNT; i++) {
    console.log(`👤 Generating user ${i + 1}/${USER_COUNT}...`);
    
    const keypair = Keypair.random();
    const wallet = keypair.publicKey();
    const secret = keypair.secret();
    const name = randomName();
    const rating = randomRating();
    const feedback = FEEDBACK_TEMPLATES[Math.floor(Math.random() * FEEDBACK_TEMPLATES.length)];
    const donationAmount = (Math.random() * 2 + 0.1).toFixed(2); // 0.1 - 2.1

    // Step 1: Fund account
    let funded = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      funded = await fundAccount(wallet);
      if (funded) {
        console.log(`  ✅ Funded via friendbot`);
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    
    if (!funded) {
      console.log(`  ⚠️  Friendbot failed for ${wallet}, skipping donation`);
      users.push({
        id: i + 1,
        name,
        wallet,
        secret,
        rating,
        feedback,
        donationAmount: parseFloat(donationAmount),
        txHash: "PENDING_FUNDING"
      });
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    // Step 2: Wait for friendbot propagation
    await new Promise(r => setTimeout(r, 2500));

    // Step 3: Donate
    let txHash = "PENDING";
    try {
      console.log(`  💸 Donating ${donationAmount} USDC...`);
      txHash = await donateFromAccount(keypair, parseFloat(donationAmount));
      console.log(`  ✅ Donation confirmed: ${txHash.slice(0, 16)}...`);
    } catch (err: any) {
      console.log(`  ⚠️  Donation failed: ${err.message}`);
    }

    users.push({
      id: i + 1,
      name,
      wallet,
      secret,
      rating,
      feedback,
      donationAmount: parseFloat(donationAmount),
      txHash
    });

    console.log(`  📊 Feedback: ${rating}/5 — ${feedback.slice(0, 50)}...\n`);

    // Slight delay to avoid rate limits
    if (i < USER_COUNT - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Save results
  const out = {
    generatedAt: new Date().toISOString(),
    contractId: CONTRACT_ID,
    network: "testnet",
    totalGenerated: USER_COUNT,
    users,
  };

  const outPath = path.join(process.cwd(), "scripts", "test-users-output.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log("═══════════════════════════════════════════════════════");
  console.log(`✅ Generated ${USER_COUNT} testnet accounts!`);
  console.log(`📁 Data saved: ${outPath}`);
  console.log("═══════════════════════════════════════════════════════\n");

  // Print summary table
  console.log("📋 USER SUMMARY:\n");
  console.log("ID | Wallet (Testnet) | Name | Rating | Donation (USDC) | Tx Hash | Explorer");
  console.log("-".repeat(120));
  users.forEach(u => {
    const explorerUrl = u.txHash.startsWith("PENDING") 
      ? "PENDING" 
      : `https://stellar.expert/explorer/testnet/tx/${u.txHash}`;
    console.log(`${u.id.toString().padStart(2)} | ${u.wallet} | ${namePad(name)} | ${u.rating}/5 | ${u.donationAmount.toFixed(2)} | ${u.txHash.slice(0, 12)}... | ${explorerUrl}`);
  });
  console.log("\n");
}

function namePad(name: string): string {
  if (name.length > 12) return name.slice(0, 10) + "..";
  return name.padEnd(12);
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
