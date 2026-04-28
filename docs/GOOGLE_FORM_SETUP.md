# Google Form Setup Guide — TulongChain User Feedback

This document explains how to create and configure the Google Form for collecting user feedback as required by the MVP submission.

## Step 1: Create the Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "+" to create a new blank form
3. Title: **"TulongChain User Feedback"**
4. Description (optional): "Help us improve disaster relief on Stellar. This survey takes <30 seconds."

## Step 2: Add Questions

Create these fields in order:

| # | Question Type | Title | Options / Settings |
|---|---------------|-------|--------------------|
| 1 | Short answer | **Wallet Address** | Required: ✅ <br> Help text: "Paste your Stellar testnet wallet address (from Freighter)" |
| 2 | Short answer | **Email** | Required: ❌ <br> Help text: "Optional — for updates on Phase 2" |
| 3 | Short answer | **Name** | Required: ❌ <br> Help text: "Your name or nickname" |
| 4 | Linear scale | **Overall Rating** | Required: ✅ <br> Label 1: "😞 Poor" <br> Label 5: "🤩 Excellent" <br> Min: 1, Max: 5 |
| 5 | Long answer | **Feedback** | Required: ✅ <br> Help text: "What features should we add? What's broken? Any suggestions?" |

## Step 3: Form Settings

Click the gear icon (Settings):
- **Responses tab**:
  - ✅ Collect email addresses: OFF (we have optional email field)
  - ✅ Limit to 1 response: OFF (allow multiple test submissions)
- **Presentation tab**:
  - ✅ Show progress bar: ON
  - ✅ Confirm on submit: ON (show link to submit another response)

## Step 4: Link to Google Sheets

1. Click **Responses** tab (top)
2. Click **Link to Sheets** icon (green spreadsheet)
3. Choose "Create a new spreadsheet"
4. Name: `TulongChain-Feedback-Responses`
5. Click **Create**

The spreadsheet will automatically receive all form submissions.

## Step 5: Get Shareable Link

1. Click **Send** button (top-right)
2. Click the link icon (🔗)
3. Shorten URL: Check "Shorten URL"
4. Copy the short link (e.g., `bit.ly/tulongchain-feedback`)
5. **Important**: Set link sharing to "Anyone with the link can respond"

## Step 6: Update README

In `README.md`, replace the placeholder link with your actual Google Form URL:

```markdown
**Google Form**: [bit.ly/tulongchain-feedback](https://bit.ly/tulongchain-feedback)
```

Also update the **Verified Testnet Users** table with wallet addresses from your actual respondents.

## Step 7: Export to Excel

After collecting ≥5 responses:

1. Open the linked Google Sheets spreadsheet
2. File → Download → Microsoft Excel (.xlsx)
3. Save as `tulongchain-feedback.xlsx`
4. Upload to your GitHub repository root or releases
5. Link in `README.md`:

```markdown
**User Feedback Excel**: [Download](tulongchain-feedback.xlsx)
```

---

## Optional: Embed in Frontend

Instead of a Google Form, our frontend has a built-in feedback modal (see `src/components/FeedbackModal.tsx`). To enable both:

1. The modal collects data to `localStorage`
2. Periodically run `scripts/export-feedback.js` to generate CSV
3. Upload CSV to the same Google Sheet as a backup

---

## Verification Checklist

- [ ] Google Form created with exactly 5 questions
- [ ] Wallet address, Email, Name, Rating, Feedback fields present
- [ ] Form linked to Google Sheets for auto-export
- [ ] Shareable link obtained and tested (submit a test response)
- [ ] Link updated in `README.md` under "User Feedback Collection"
- [ ] Final Excel export (`.xlsx`) uploaded to GitHub
- [ ] Excel file linked in `README.md`

---

## Need Help?

- Full feedback analysis template: see [`FEEDBACK.md`](../FEEDBACK.md)
- Sample CSV export: [`scripts/feedback-sample.csv`](../scripts/feedback-sample.csv) (if generated)
