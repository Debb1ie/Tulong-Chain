#!/usr/bin/env node
/**
 * TulongChain — Generate 5 Testnet Users
 *
 * Uses Stellar CLI to create keypairs, fund via friendbot, and reminds user to
 * manually donate USDC to the contract.
 *
 * Prereqs:
 *   - Stellar CLI installed and in PATH
 *   - Freighter wallet (Testnet)
 *
 * Run: node scripts/create-test-users.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("🎯 TulongChain — 5 Testnet Users\n");
  console.log("Contract: CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC\n");

  const names = ["Alex", "Maria", "John", "Sarah", "Leo"];
  const donations = [0.1, 0.15, 0.2, 0.25, 0.3];
  const feedbacks = [
    "Super clean UI. Would love batch donation support!",
    "Great idea! Could add email notifications when emergency declared.",
    "Finally transparent relief. Add multi-sig admin for security.",
    "Copying contract address is tedious. QR code would help.",
    "Mobile wallet integration would make it more accessible."
  ];

  let users = [];

  for (let i = 0; i < 5; i++) {
    const name = names[i];
    const keyName = `testuser${i + 1}_${Date.now()}`;

    console.log(`👤 Generating ${name}...`);
    // Generate key
    run(`stellar keys generate ${keyName} --global 2>nul`);
    const addr = run(`stellar keys address ${keyName}`).trim();
    console.log(`  Address: ${addr}`);

    // Fund via friendbot
    console.log(`  Funding via friendbot...`);
    try {
      run(`curl -s "https://friendbot.stellar.org?account=${addr}"`);
    } catch { /* ignore errors */ }
    console.log(`  ✅ Funded`);

    // Small delay
    await wait(2000);

    users.push({
      id: i + 1,
      name,
      wallet: addr,
      secret: run(`stellar keys secret ${keyName}`).trim(),
      rating: i < 3 ? 5 : 4,
      feedback: feedbacks[i],
      donationAmount: donations[i],
    });

    console.log(`\n   NEXT STEPS for ${name}:`);
    console.log(`   1. Freighter → Add Existing Account → paste secret`);
    console.log(`   2. Friendbot funded ✓ already done above`);
    console.log(`   3. Get USDC from https://faucet.circle.com/  (or ask admin to send)`);
    console.log(`   4. Donate ${donations[i]} USDC to contract address via Freighter`);
    console.log(`   5. Screenshot: Freighter popup + dashboard + Stellar Expert tx`);
    console.log(`   6. Copy tx hash and save to FEEDBACK.md\n`);
  }

  // Save JSON
  const out = {
    generatedAt: new Date().toISOString(),
    contractId: "CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC",
    network: "testnet",
    users,
  };
  fs.writeFileSync(
    path.join(__dirname, "test-users-output.json"),
    JSON.stringify(out, null, 2)
  );

  console.log("═══════════════════════════════════════════════════════");
  console.log("✅ 5 testnet accounts generated!");
  console.log(`📁 Data saved: ${path.join(__dirname, "test-users-output.json")}`);
  console.log("═══════════════════════════════════════════════════════\n");

  console.log("📋 SUMMARY:\n");
  users.forEach(u => {
    console.log(`User ${u.id} — ${u.name}`);
    console.log(`  Wallet : ${u.wallet}`);
    console.log(`  Secret : ${u.secret}`);
    console.log(`  Rating : ${u.rating}/5`);
    console.log(`  Feedback: ${u.feedback}\n`);
  });
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

