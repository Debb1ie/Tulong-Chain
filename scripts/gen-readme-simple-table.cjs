const data = require("../frontend/test-users-output.json");
const rows = data.users.map(u => {
  const validTx = u.txHash && u.txHash !== "FUND_FAILED" && !u.txHash.startsWith("PENDING");
  const explorer = validTx ? `[View](https://stellar.expert/explorer/testnet/tx/${u.txHash})` : "N/A";
  const walletCode = `\`${u.wallet}\``;
  // Use name, rating, tx hash short, explorer
  return `| ${u.id} | ${walletCode} | ${u.name} | ${u.rating}/5 | ${u.txHash ? u.txHash.slice(0,12)+'...' : 'N/A'} | ${explorer} |`;
});
console.log(rows.join("\n"));
