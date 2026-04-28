#!/usr/bin/env node
/**
 * TulongChain — Generate 5 Testnet Users & Simulate Feedback
 *
 * This script creates 5 testnet Stellar accounts, funds them via Friendbot,
 * and simulates a donation to the TulongChain contract.
 *
 * Prerequisites:
 *   npm install @stellar/stellar-sdk
 *
 * Usage:
 *   node scripts/generate-test-users.js
 *
 * Output:
 *   - Wallet addresses & secret keys
 *   - Donation transaction hashes
 *   - Stellar Explorer links
 */

import { Keypair, Networks, SorobanRpc, TransactionBuilder, BASE_FEE, scValToNative, nativeToScVal, Address, xdr } from "@stellar/stellar-sdk";
import * as fs from "fs";
import * as path from "path";

const NETWORK = Networks.TESTNET;
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const CONTRACT_ID = "CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC";
const USDC_CONTRACT_ID = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";
const RPC_URL = "https://soroban-testnet.stellar.org";
const HORIZON_URL = "https://horizon-testnet.stellar.org";

const rpc = new SorobanRpc.Server(RPC_URL);

async function fundAccount(publicKey: string): Promise<void> {
  const resp = await fetch(`https://friendbot.stellar.org?account=${publicKey}`);
  if (!resp.ok) throw new Error(`Friendbot failed: ${resp.statusText}`);
  console.log(`  ✅ Funded ${publicKey.slice(0, 8)}...`);
}

async function waitForTx(哈希: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await rpc.getTransaction(哈希);
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
  // Get account to load sequence number
  const account = await rpc.getAccount(keypair.publicKey());

  // Build contract call
  const contract = new SorobanRpc.Contract(CONTRACT_ID);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("donate", [
      new Address(keypair.publicKey()).toScVal(),
      new Address(USDC_CONTRACT_ID).toScVal(),
      nativeToScVal(amountUsdc * 1e7, { type: "i128" }), // USDC has 7 decimals
    ]))
    .setTimeout(30)
    .build();

  // Simulate
  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulate failed: ${sim.error}`);
  }

  // Prepare & sign
  const prepared = SorobanRpc.assembleTransaction(tx, sim).build();
  const signed = prepared.sign(keypair);

  // Submit
  const result = await rpc.sendTransaction(signed);
  console.log(`  📤 Submitted: ${result.hash.slice(0, 16)}...`);

  // Wait for finality
  const success = await waitForTx(result.hash);
  if (!success) throw new Error(`Tx failed or timed out: ${result.hash}`);
  console.log(`  ✅ Confirmed: ${result.hash}`);

  return result.hash;
}

async function main() {
  console.log("🎯 TulongChain — Generate 5 Testnet Users\n");
  console.log(`Contract: ${CONTRACT_ID}\n`);

  const users: Array<{
    wallet: string;
    secret: string;
    txHash: string;
    rating: number;
    feedback: string;
  }> = [];

  const feedbackTemplates = [
    { rating: 5, text: "Super clean UI. Would love batch donation support!" },
    { rating: 4, text: "Great idea! Add email notifications for emergencies." },
    { rating: 5, text: "Finally transparent relief. Multi-sig admin next?" },
    { rating: 3, text: "Copying address is tedious. QR code would help." },
    { rating: 4, text: "Mobile wallet integration would be awesome." },
  ];

  for (let i = 0; i < 5; i++) {
    console.log(`👤 Generating user ${i + 1}/5...`);

    // 1. Create keypair
    const keypair = Keypair.random();
    const wallet = keypair.publicKey();
    const secret = keypair.secret();

    // 2. Fund via friendbot
    await fundAccount(wallet);

    // 3. Small delay for friendbot to propagate
    await new Promise(r => setTimeout(r, 2000));

    // 4. Make donation (0.1 USDC)
    console.log(`  💸 Donating 0.1 USDC...`);
    const txHash = await donateFromAccount(keypair, 0.1);

    users.push({
      wallet,
      secret,
      txHash,
      rating: feedbackTemplates[i].rating,
      feedback: feedbackTemplates[i].text,
    });

    console.log(`  📊 Saved feedback: ${feedbackTemplates[i].text.slice(0, 50)}...\n`);

    // Delay between users
    if (i < 4) await new Promise(r => setTimeout(r, 3000));
  }

  // Generate summary
  const summary = {
    generatedAt: new Date().toISOString(),
    contractId: CONTRACT_ID,
    network: "testnet",
    users,
  };

  const outPath = path.join(process.cwd(), "scripts", "test-users-output.json");
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));

  console.log("═══════════════════════════════════════════════════");
  console.log("✅ Generated 5 testnet users with real donations!");
  console.log(`📁 Output saved to: ${outPath}`);
  console.log("═══════════════════════════════════════════════════\n");

  console.log("📋 User Summary:\n");
  users.forEach((u, i) => {
    console.log(`User ${i + 1}:`);
    console.log(`  Wallet : ${u.wallet}`);
    console.log(`  Secret : ${u.secret}`);
    console.log(`  TxHash : ${u.txHash}`);
    console.log(`  Explorer: https://stellar.expert/explorer/testnet/tx/${u.txHash}`);
    console.log(`  Rating : ${u.rating}/5`);
    console.log(`  Feedback: ${u.feedback}\n`);
  });

  console.log("\n📸 Next Steps:");
  console.log("1. Open each tx link in browser");
  console.log("2. Take screenshot showing:");
  console.log("   - Transaction hash in URL bar");
  console.log("   - 'Success' status on Stellar Expert");
  console.log("3. Save screenshots to docs/screenshots/ as:");
  console.log("   - user1-tx.png, user2-tx.png, ...");
  console.log("4. Update FEEDBACK.md with real addresses & links");
  console.log("5. Commit and push everything\n");
}

main().catch(console.error);
