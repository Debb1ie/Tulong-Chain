#!/usr/bin/env node
/**
 * Generate tulongchain-feedback.csv from test-users-output.json
 * Output: tulongchain-feedback.csv (Excel-compatible)
 */

const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "test-users-output.json"), "utf8"));

const headers = ["Timestamp", "Wallet Address", "Name", "Email", "Rating", "Feedback"];
const rows = [headers.join(",")];

data.users.forEach(u => {
  const ts = new Date().toISOString();
  const name = `"${u.name.replace(/"/g, '""')}"`;
  const email = `""`; // not provided
  const feedback = `"${u.feedback.replace(/"/g, '""')}"`;
  rows.push([ts, u.wallet, name, email, u.rating, feedback].join(","));
});

fs.writeFileSync(path.join(__dirname, "..", "tulongchain-feedback.csv"), rows.join("\n"));
console.log("✅ tulongchain-feedback.csv generated");
