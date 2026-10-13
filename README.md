# n8n AI Automation Portfolio

Four n8n workflows built with Google Gemini, Telegram, Google Sheets, Gmail and Google Calendar.
Built by Basmala Taha as hands-on practice in AI-assisted automation with human-in-the-loop control.

| # | Workflow | What it does |
|---|----------|--------------|
| 1 | **AI Content Studio** (`01-ai-content-studio.json`) | Form -> Gemini generates social posts for a drama series (dialect, platform limits, spoiler policy) -> a second Gemini call reviews them against a strict rubric -> up to 2 automatic retries with fix instructions -> Telegram approval -> Google Sheets + Gmail. Falls back to "NEEDS MANUAL EDIT" if quality stays low. Everything is logged. |
| 2 | **Lab Meeting Bot** (`02-lab-meeting-bot.json`) | Telegram chat agent (Gemini + memory) that books, reschedules and cancels meetings in Google Calendar with a Meet link and logs them to Sheets. |
| 3 | **Monthly Report Digest** (`03-monthly-report-digest.json`) | Day 5: digest of submitted monthly reports. Day 10: reminders to members who have not submitted. |
| 4 | **Progress Sheets Change Alerts** (`04-progress-sheets-change-alerts.json`) | Apps Script sends each edit to a secured webhook, changes are logged, and a daily digest goes out on Telegram/Gmail. |
| 0 | **Error Alert** (`00-error-alert.json`) | Optional error workflow: sends a Telegram message when any workflow fails. |

## Design ideas worth noting
- LLM output is forced into structured JSON, then **checked by a separate reviewer prompt** (score + issues + fix instructions).
- Bounded retry loop, then a human decides (Telegram Send-and-Wait approval).
- Webhook protected by a shared secret header (401 otherwise).
- Telegram Markdown is escaped and messages are kept under 4096 chars.
- Retry-on-fail on LLM nodes, error workflow, and an audit log in Sheets.

## Import
1. In n8n: **Workflows -> Import from file** and choose a JSON from `workflows/`.
2. Create your own credentials (Telegram, Google Sheets, Gmail, Gemini, Google Calendar) and select them in each node.
3. Create the Google Sheets from `sheets-templates/README.md` and pick them in the Sheets nodes.
4. Replace the placeholders: `YOUR_TELEGRAM_CHAT_ID`, `YOUR_GOOGLE_SHEET_ID`, `YOUR_PROFESSOR_EMAIL`, `YOUR_SHARED_SECRET`.
5. For workflow 4, paste `apps-script/onEdit.gs` into the sheet's Apps Script, set the production webhook URL + secret, and add an installable **On edit** trigger.
6. Publish the workflows you want active.

## Security
No tokens, chat IDs, emails, sheet IDs or credential IDs are included. Do not commit them if you fork this.

## Demo
_Add screenshots to `docs/screenshots/` and a short video link here._

## License
MIT
