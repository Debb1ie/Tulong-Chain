// src/lib/feedback.ts
import type { FeedbackData } from "../components/FeedbackModal";

const FEEDBACK_STORAGE_KEY = "tulong_feedback_all";

/** Get all stored feedback data */
export function getAllFeedback(): FeedbackData[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/** Save a single feedback entry */
export function saveFeedback(entry: FeedbackData) {
  const list = getAllFeedback();
  list.push(entry);
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
}

/** Clear all feedback (dev only) */
export function clearFeedback() {
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
}

/** Export feedback as CSV string */
export function exportFeedbackToCSV(): string {
  const data = getAllFeedback();
  if (data.length === 0) return "No feedback data available";

  const headers = [
    "Timestamp",
    "Wallet Address",
    "Name",
    "Email",
    "Rating (1-5)",
    "Feedback",
  ];

  const rows = data.map((item) => [
    new Date(item.timestamp).toISOString(),
    `"${item.walletAddress}"`,
    `"${item.name || ""}"`,
    `"${item.email || ""}"`,
    item.rating.toString(),
    `"${item.feedback.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/** Download feedback as CSV file */
export function downloadFeedbackCSV(filename: string = "tulongchain-feedback.csv") {
  const csv = exportFeedbackToCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
