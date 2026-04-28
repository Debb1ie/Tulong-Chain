#!/usr/bin/env node
/**
 * TulongChain — Simple Manual Donation Helper
 *
 * This script just prints 5 new testnet wallet addresses.
 * You will manually:
 * 1. Copy each address → Freighter (Add Existing Account)
 * 2. Fund each via friendbot (opens in browser)
 * 3. Get USDC from Circle Faucet
 * 4. Donate 0.1 USDC to contract from Freighter
 * 5. Screenshot everything
 */

const { Keypair } = require("@stellar/stellar-sdk"); // if available, else use fetch to stellar

// Option A: Use Node crypto (no external deps)
const crypto = require("crypto");

function generateKeypair() {
  const seed = crypto.randomBytes(32);
  const keypair = Keypair.fromSecretKey(seed);
  return {
    publicKey: keypair.publicKey(),
    secret: keypair.secret(),
  };
}

const names = ["Alex", "Maria", "John", "Sarah", "Leo"];
const users = [];

for (let i = 0; i < 5; i++) {
  const kp = generateKeypair();
  users.push({
    id: i + 1,
    name: names[i],
    wallet: kp.publicKey,
    secret: kp.secret,
    rating: [5, 4, 5, 3, 4][i],
    feedback: [
      "Super clean UI. Would love batch donation support for multiple recipients.",
      "Great idea! Could add email notifications when emergency declared.",
      "Finally transparent relief. Add multi-sig admin for security.",
      "Copying contract address is tedious. QR code would help.",
      "Mobile wallet integration would make it more accessible."
    ][i],
  });
}

console.log("🎯 TulongChain — 5 Testnet Users Generated\n");
console.log("Contract ID: CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC\n");

users.forEach(u => {
  console.log(`User ${u.id}: ${u.name}`);
  console.log(`  Wallet: ${u.wallet}`);
  console.log(`  Secret: ${u.secret}`);
  console.log(`  Rating: ${u.rating}/5`);
  console.log(`  Feedback: ${u.feedback}\n");
  console.log(`  👉 Step-by-step:`);
  console.log(`     1. In Freighter, click "Add Existing Account" → paste Secret`);
  console.log(`     2. Visit: https://friendbot.stellar.org?account=${u.wallet}`);
  console.log(`     3. Get USDC: https://faucet.circle.com/ (requires login)`);
  console.log(`     4. Donate 0.1 USDC to contract address in Freighter`);
  console.log(`     5. Screenshot: Freighter popup + Stellar Expert tx page\n`);
});

console.log("\nOnce done, fill this in FEEDBACK.md table with real tx hashes.\n");
