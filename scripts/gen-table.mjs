const data = require("../frontend/test-users-output.json");
const rows = data.users.map(u => {
  const expl = (u.txHash && u.txHash !== "FUND_FAILED" && !u.txHash.startsWith("PENDING"))
    ? `[View](https://stellar.expert/explorer/testnet/tx/${u.txHash})`
    : "N/A";
  const nameShort = u.name.length > 12 ? u.name.slice(0,10) + ".." : u.name;
  const fb = u.feedback.replace(/"/g, "'").slice(0, 38);
  return `| ${u.id} | \`${u.wallet}\` | ${nameShort} | ${u.rating}/5 | "${fb}..." | ${u.txHash ? u.txHash.slice(0,12) : 'N/A'}... | ${expl} |`;
});
const table = [
  "| # | Wallet (Testnet) | Name | Rating | Feedback Summary | Tx Hash | Explorer |",
  "|---|---|---|---|---|---|---|",
  ...rows
].join("\n");
console.log(table);
