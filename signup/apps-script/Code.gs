/**
 * BinaryHeart Northwestern: mailing list signup collector.
 *
 * Install this as a container-bound script on the signup Google Sheet
 * (Extensions → Apps Script), signed in as the chapter Gmail account that
 * receives mail for nu@binaryheart.org. See signup/README.md for setup.
 *
 * It does two things:
 *   1. doPost: receives web signups from the Cloudflare Pages function.
 *   2. processMailtoSignups: runs every few minutes, finds the pre-filled
 *      "join" emails in the inbox, and adds the sender (or the Northwestern
 *      email they typed in the body) to the sheet.
 */

const CONFIG = {
  SHEET_NAME: 'Signups',
  CHAPTER_NAME: 'BinaryHeart at Northwestern',
  CHAPTER_ADDRESS: 'nu@binaryheart.org',
  // Must match MAILTO_SUBJECT in signup/public/index.html.
  MAILTO_SUBJECT: 'Join the BinaryHeart NU mailing list',
  PROCESSED_LABEL: 'Mailing List Signup',
  // Send a short "you're on the list" email to each new signup.
  SEND_CONFIRMATION: true,
  INSTAGRAM_URL: 'https://instagram.com/binaryheartatnu',
  TRIGGER_MINUTES: 5,
};

const HEADERS = ['Timestamp', 'Email', 'Northwestern', 'Method', 'Source', 'Notes'];
const NU_EMAIL = /^[a-z0-9._%+'-]+@(u\.)?northwestern\.edu$/;
const NU_EMAIL_IN_TEXT = /[a-z0-9._%+'-]+@(?:u\.)?northwestern\.edu/gi;

/* ------------------------------------------------------------------------ */
/* One-time setup                                                           */
/* ------------------------------------------------------------------------ */

/** Run once from the editor. Creates the sheet, label, secret, and trigger. */
function setup() {
  getSheet_();
  GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL) || GmailApp.createLabel(CONFIG.PROCESSED_LABEL);

  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SIGNUP_SECRET')) {
    props.setProperty('SIGNUP_SECRET', Utilities.getUuid());
  }
  if (!props.getProperty('LAST_MAIL_CHECK')) {
    // Pick up signups sent in the last week on the first run.
    props.setProperty('LAST_MAIL_CHECK', String(Date.now() - 7 * 24 * 60 * 60 * 1000));
  }

  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'processMailtoSignups')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('processMailtoSignups').timeBased().everyMinutes(CONFIG.TRIGGER_MINUTES).create();

  Logger.log('Setup done. SIGNUP_SECRET for Cloudflare: %s', props.getProperty('SIGNUP_SECRET'));
}

/* ------------------------------------------------------------------------ */
/* Web signups (from Cloudflare Pages)                                      */
/* ------------------------------------------------------------------------ */

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }

  const secret = PropertiesService.getScriptProperties().getProperty('SIGNUP_SECRET');
  if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' });

  const email = String(body.email || '').trim().toLowerCase();
  if (!NU_EMAIL.test(email)) return json_({ ok: false, error: 'not_northwestern' });

  const result = addSignup_(email, 'web', body.source || 'web', '');
  if (result.added && CONFIG.SEND_CONFIRMATION) sendConfirmation_(email);
  return json_({ ok: true, duplicate: !result.added });
}

function doGet() {
  return json_({ ok: true, service: 'binaryheart-nu-signup' });
}

/* ------------------------------------------------------------------------ */
/* Mailto signups (from the chapter inbox)                                  */
/* ------------------------------------------------------------------------ */

/** Time-driven: every CONFIG.TRIGGER_MINUTES minutes. Safe to run by hand. */
function processMailtoSignups() {
  const props = PropertiesService.getScriptProperties();
  const since = Number(props.getProperty('LAST_MAIL_CHECK')) || Date.now() - 24 * 60 * 60 * 1000;
  const startedAt = Date.now();

  // Overlap the window by 10 minutes; addSignup_ dedupes so reprocessing is harmless.
  const afterSeconds = Math.floor((since - 10 * 60 * 1000) / 1000);
  const query = `subject:"${CONFIG.MAILTO_SUBJECT}" after:${afterSeconds} -in:sent -in:drafts`;
  const label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL) || GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
  const me = [CONFIG.CHAPTER_ADDRESS, Session.getEffectiveUser().getEmail()].map(s => s.toLowerCase());

  GmailApp.search(query, 0, 100).forEach(thread => {
    thread.getMessages().forEach(message => {
      if (message.getDate().getTime() < since - 10 * 60 * 1000) return;
      const from = extractAddress_(message.getFrom());
      if (!from) return;
      const fromUs = me.indexOf(from) !== -1;

      // Prefer a Northwestern address typed in the body (people often send from a
      // personal account), then the sender if it's already a Northwestern address.
      const typed = latestReplyText_(message.getPlainBody()).match(NU_EMAIL_IN_TEXT) || [];
      const nuEmail = typed.map(s => s.toLowerCase()).find(s => NU_EMAIL.test(s)) ||
        (NU_EMAIL.test(from) && !fromUs ? from : null);

      // Our own replies are in these threads too; only count one if it carries a
      // signup (e.g. the web fallback sent from a chapter phone at tabling).
      if (fromUs && !nuEmail) return;

      if (nuEmail) {
        const result = addSignup_(nuEmail, 'email', 'mailto', nuEmail === from ? '' : `Sent from ${from}`);
        if (result.added && CONFIG.SEND_CONFIRMATION && !fromUs) {
          message.reply(confirmationText_(nuEmail), { name: CONFIG.CHAPTER_NAME });
        }
      } else {
        // Keep the address so nobody is lost, and ask once for their Northwestern email.
        const result = addSignup_(from, 'email', 'mailto', 'Needs Northwestern email');
        if (result.added) {
          message.reply(needsNuEmailText_(), { name: CONFIG.CHAPTER_NAME });
        }
      }
    });
    thread.addLabel(label);
  });

  props.setProperty('LAST_MAIL_CHECK', String(startedAt));
}

/* ------------------------------------------------------------------------ */
/* Sheet helpers                                                            */
/* ------------------------------------------------------------------------ */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

/** Appends a row unless the email is already present. Returns { added }. */
function addSignup_(email, method, source, notes) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      if (existing.some(row => String(row[0]).toLowerCase() === email)) return { added: false };
    }
    sheet.appendRow([new Date(), email, NU_EMAIL.test(email), method, source, notes]);
    return { added: true };
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------------ */
/* Email helpers                                                            */
/* ------------------------------------------------------------------------ */

function extractAddress_(from) {
  const match = String(from).match(/<([^>]+)>/);
  return (match ? match[1] : String(from)).trim().toLowerCase();
}

/** Drops quoted history so we don't pick up addresses from earlier messages. */
function latestReplyText_(body) {
  return String(body).split(/\n\s*(?:On .+wrote:|-----Original Message-----|From: .+)\s*\n/)[0];
}

function sendConfirmation_(email) {
  GmailApp.sendEmail(email, "You're on the BinaryHeart Northwestern list", confirmationText_(email), {
    name: CONFIG.CHAPTER_NAME,
    replyTo: CONFIG.CHAPTER_ADDRESS,
  });
}

function confirmationText_(email) {
  return [
    `You're on the list! We'll send BinaryHeart Northwestern updates to ${email}.`,
    '',
    'We meet Monday, Wednesday, and Friday, 3:30–5:00 PM at the BinaryHeart Space on Orrington Ave. Drop in anytime, no experience needed.',
    '',
    `Follow us on Instagram: ${CONFIG.INSTAGRAM_URL}`,
    '',
    `– ${CONFIG.CHAPTER_NAME}`,
  ].join('\n');
}

function needsNuEmailText_() {
  return [
    'Thanks for joining BinaryHeart at Northwestern!',
    '',
    'One quick thing: reply with your @u.northwestern.edu email so we can add you to our Cats on Campus page too. (Northwestern only lets us add Northwestern emails.)',
    '',
    `– ${CONFIG.CHAPTER_NAME}`,
  ].join('\n');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
