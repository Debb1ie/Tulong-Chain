const data = require("../frontend/test-users-output.json");
const rows = data.users.map(u => {
  const validTx = u.txHash && u.txHash !== "FUND_FAILED" && !u.txHash.startsWith("PENDING");
  const explorer = validTx ? `[View](https://stellar.expert/explorer/testnet/tx/${u.txHash})` : "N/A";
  const walletCode = `\`${u.wallet}\``;
  const nameDisplay = u.name.length > 12 ? u.name.slice(0,10) + ".." : u.name;
  const fb = u.feedback.replace(/"/g, "'").slice(0, 35);
  return `| ${u.id} | ${walletCode} | ${nameDisplay} | ${u.rating}/5 | "${fb}..." | ${u.txHash ? u.txHash.slice(0,12)+'...' : 'N/A'} | ${explorer} |`;
});
console.log(rows.join("\n"));
