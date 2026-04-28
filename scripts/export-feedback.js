#!/usr/bin/env node
/**
 * TulongChain Feedback Export Script
 *
 * This script exports feedback data from the browser's localStorage
 * to a CSV file. Run it from the project root:
 *
 *   node scripts/export-feedback.js [output-file]
 *
 * Example:
 *   node scripts/export-feedback.js tulongchain-feedback.csv
 *
 * How to use:
 * 1. Open the TulongChain app in your browser
 * 2. Let users submit feedback via the dashboard modal
 * 3. Open browser console and run:
 *    copy(localStorage.getItem('tulong_feedback_all'))
 * 4. Save the output to a file named 'feedback-raw.json' in ./scripts/
 * 5. Run this script to convert to CSV
 *
 * Or use the in-app export button (if admin tools enabled).
 */

import * as fs from "fs";
import * as path from "path";

function jsonToCsv(data: any[]): string {
  if (data.length === 0) return "";

  const headers = [
    "Timestamp",
    "Wallet Address",
    "Name",
    "Email",
    "Rating",
    "Feedback",
  ];

  const rows = data.map((item) => [
    new Date(item.timestamp).toISOString(),
    `"${item.walletAddress}"`,
    `"${item.name || ""}"`,
    `"${item.email || ""}"`,
    item.rating.toString(),
    `"${(item.feedback || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const outputFile = args[0] || "tulongchain-feedback.csv";
  const inputPath = path.join(__dirname, "feedback-raw.json");

  try {
    const rawData = fs.readFileSync(inputPath, "utf-8");
    const data = JSON.parse(rawData);

    if (!Array.isArray(data) || data.length === 0) {
      console.log("No feedback data found in feedback-raw.json");
      process.exit(0);
    }

    const csv = jsonToCsv(data);
    const outPath = path.join(process.cwd(), outputFile);
    fs.writeFileSync(outPath, csv, "utf-8");
    console.log(`✅ Exported ${data.length} feedback entries to ${outPath}`);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.error(`
❌ File not found: ${inputPath}
Steps to export:
1. Open browser console on TulongChain Dashboard
2. Run: const d = localStorage.getItem('tulong_feedback_all');
3. Save output to: scripts/feedback-raw.json
4. Re-run this script.
      `.trim());
    } else {
      console.error("Export failed:", err.message);
    }
    process.exit(1);
  }
}

main();
