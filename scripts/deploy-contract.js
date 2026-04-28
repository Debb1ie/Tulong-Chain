#!/usr/bin/env node
/**
 * TulongChain — Quick Deploy to Stellar Testnet
 *
 * This script builds the contract and deploys a fresh instance.
 * NOTE: This creates a NEW contract address. You must update frontend/.env
 *
 * Prereqs:
 * - Stellar CLI installed and authenticated
 * - Rust toolchain with wasm32 target
 *
 * Run: node scripts/deploy-contract.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd, desc) {
  console.log(`\n📦 ${desc}...`);
  try {
    const out = execSync(cmd, { encoding: "utf8" });
    console.log(out.trim().split("\n").slice(-3).join("\n"));
    return out;
  } catch (e) {
    console.error(`❌ Failed: ${e.message}`);
    process.exit(1);
  }
}

async function main() {
  console.log("🚀 TulongChain — Deploy to Testnet\n");

  // 1. Build WASM
  run("cargo build --target wasm32-unknown-unknown --release", "Building WASM");

  const wasmPath = "target/wasm32-unknown-unknown/release/tulong_chain.wasm";
  if (!fs.existsSync(wasmPath)) {
    console.error("❌ WASM not found at", wasmPath);
    process.exit(1);
  }

  // 2. Generate deployer key (or use existing)
  console.log("\n🔑 Generating deployer key...");
  try {
    run("stellar keys generate deployer --global", "Key generated");
  } catch {
    // key may exist; continue
  }

  // 3. Fund deployer via friendbot
  const addr = execSync("stellar keys address deployer", { encoding: "utf8" }).trim();
  console.log(`\n💰 Funding deployer (${addr}) via friendbot...`);
  run(`curl -s "https://friendbot.stellar.org?account=${addr}" > nul`, "Friendbot funded");

  // 4. Deploy
  console.log("\n📤 Deploying contract...");
  const deployOut = run(
    `stellar contract deploy --wasm ${wasmPath} --source deployer --network testnet`,
    "Deploying"
  );

  const contractIdMatch = deployOut.match(/Deployed contract ID: (\w+)/i);
  const contractId = contractIdMatch ? contractIdMatch[1] : null;

  if (!contractId) {
    console.error("❌ Could not extract contract ID from output");
    process.exit(1);
  }

  console.log(`\n✅ Contract deployed!`);
  console.log(`   Contract ID: ${contractId}`);

  // 5. Initialize
  console.log("\n⚙️ Initializing contract...");
  run(
    `stellar contract invoke --id ${contractId} --source deployer --network testnet -- initialize --admin ${addr}`,
    "Contract initialized"
  );

  console.log("\n═══════════════════════════════════════════════════");
  console.log("✅ DEPLOYMENT COMPLETE");
  console.log(`📋 Contract ID: ${contractId}`);
  console.log("═══════════════════════════════════════════════════\n");

  console.log("➡️  NEXT STEP: Update frontend/.env:");
  console.log(`   VITE_CONTRACT_ID=${contractId}`);
  console.log("\nThen restart frontend: cd frontend && npm run dev\n");
}

main().catch(console.error);
