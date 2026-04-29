const data = require("./frontend/test-users-output.json");
const { format } = require("date-fns"); // if available? else use toISO

// If date-fns not installed, just use ISO string
const rows = [];
// Header
rows.push(["Timestamp", "Wallet Address", "Name", "Email", "Rating", "Feedback"].join(","));
for (const u of data.users) {
  const ts = new Date().toISOString(); // approximate
  const name = `"${u.name}"`;
  const email = `""`; // empty
  const feedback = `"${u.feedback.replace(/"/g, '""')}"`;
  rows.push([ts, u.wallet, name, email, u.rating, feedback].join(","));
}
console.log(rows.join("\n"));
