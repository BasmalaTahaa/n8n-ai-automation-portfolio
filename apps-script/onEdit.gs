/**
 * Sends every edit in a progress sheet to the n8n webhook.
 * Setup: Extensions > Apps Script > paste this > fill the 3 constants below
 * > Triggers (clock icon) > Add trigger > function: onSheetEdit,
 *   event source: From spreadsheet, event type: On edit.  (Must be an INSTALLABLE trigger.)
 */
var WEBHOOK_URL   = 'YOUR_N8N_PRODUCTION_WEBHOOK_URL'; // .../webhook/lab-changes
var SHARED_SECRET = 'YOUR_SHARED_SECRET';              // same value as in the n8n "Secret Header Valid?" node
var RATE_LIMIT_MS = 5000;                              // ignore repeated edits of the same cell within 5s

function onSheetEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var cell  = e.range.getA1Notation();

  // simple per-cell rate limit
  var cache = CacheService.getScriptCache();
  var key   = sheet.getName() + '!' + cell;
  if (cache.get(key)) return;
  cache.put(key, '1', Math.ceil(RATE_LIMIT_MS / 1000));

  var ss = e.source;
  var payload = {
    sheet_name:   sheet.getName(),
    cell:         cell,
    old_value:    e.oldValue === undefined ? '' : String(e.oldValue),
    new_value:    e.value    === undefined ? '' : String(e.value),
    editor_email: Session.getActiveUser().getEmail() || 'unknown',
    file_url:     ss.getUrl(),
    timestamp:    new Date().toISOString()
  };

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-secret': SHARED_SECRET },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    console.error('Webhook failed: ' + err);
  }
}
