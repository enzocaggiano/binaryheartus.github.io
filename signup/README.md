# NU Mailing List Signup

A small, standalone signup site that collects Northwestern emails for the BinaryHeart NU chapter. It's separate from the main React site. It deploys to **Cloudflare Pages**, and every signup goes into a **Google Sheet**.

```
            ┌───────────── Web flow ─────────────┐
Phone ──▶  signup page ──▶ /api/join (CF Pages Function) ──▶ Apps Script doPost ──▶ Google Sheet
            └── "Join by email instead" ──▶ nu@binaryheart.org ──▶ Apps Script (every 5 min) ──┘
```

| Path | What it is |
| --- | --- |
| `public/index.html` | The signup page. Plain HTML/CSS/JS with no build step |
| `functions/api/join.js` | Cloudflare Pages Function. Validates the email and forwards it to Apps Script |
| `apps-script/Code.gs` | Google Apps Script bound to the Sheet. Handles web signups and scans the inbox for mailto signups |
| `wrangler.toml` | Cloudflare Pages project config |

## Signup flows

Every flow ends in the same Sheet and is deduplicated by email.

1. **Web page, one field and one tap.** People type only the part before the @. `@u.northwestern.edu` is added for them, and a full address is also accepted. The page blocks non-Northwestern addresses and catches common typos (`u.northwestern.com` → "Did you mean…?"). It uses `autocomplete="email"`, so iOS/Android keyboards suggest the saved address, and `enterkeyhint="go"`, so the keyboard's Go key submits.
2. **Pre-filled email.** The "Join by email instead" button opens the mail app with the recipient, subject, and body already filled in, so people only tap Send. The Apps Script checks the inbox every 5 minutes and adds the sender automatically.
   - If they send from a personal account (common on iPhone, where Mail defaults to iCloud/Gmail), the script saves that address with the note *Needs Northwestern email* and replies once to ask for their Northwestern email. When they reply, their Northwestern address is picked up from the reply and added.
   - Direct mailto link for GroupMe, Instagram, and email:
     `mailto:nu@binaryheart.org?subject=Join%20the%20BinaryHeart%20NU%20mailing%20list&body=Hi%20BinaryHeart!%20Please%20add%20me%20to%20the%20Northwestern%20chapter%20mailing%20list.`
3. **Automatic fallback.** If the web path fails (Apps Script down, no signal at tabling), the page shows a **Join by email** button with the person's address already in the body, so nobody is lost.
4. **Tabling kiosk.** Open `…/?kiosk` on a chapter iPad or phone. After each signup the page resets in 4 seconds for the next person, doesn't remember anyone on the device, hides the mailto option, and records the source as `tabling`.
5. **Returning visitors.** The page remembers the last signup on that device and shows "You're already on the list" instead of the form.

### Links for each channel

Add `?src=` so the Sheet shows where each signup came from:

| Channel | Link |
| --- | --- |
| Flyers (QR code) | `https://binaryheart-nu-join.pages.dev/?src=flyer` |
| Instagram bio / story link | `https://binaryheart-nu-join.pages.dev/?src=instagram` |
| GroupMe | `https://binaryheart-nu-join.pages.dev/?src=groupme` |
| Email blasts | `https://binaryheart-nu-join.pages.dev/?src=email` |
| Tabling iPad | `https://binaryheart-nu-join.pages.dev/?kiosk` |
| Main website (already linked from `/nu/join`) | `https://binaryheart-nu-join.pages.dev/?src=website` |

### iPhone-native options (no app needed)

- **QR code on flyers.** The iPhone Camera reads it with no app. Point it at the `?src=flyer` link.
- **NFC sticker at the table.** Write the `?src=tabling` URL to an NTAG213 sticker (about $0.50) with any NFC writer app. iPhone XS and newer read NFC tags in the background, so people just hold their phone near the sticker and tap the notification.
- **"Scan to email" QR.** A QR code that encodes the `mailto:` link above opens a ready-to-send email straight from the Camera app. It's good for people who won't type anything.
- **AirDrop at tabling.** AirDrop the link from a chapter phone, and it opens in Safari automatically.

App Clips could run the flow without opening Safari, but they need a published App Store app, which is overkill for collecting emails.

## Setup (one time, about 15 minutes)

### 1. Google Sheet + Apps Script

1. Sign in as the **chapter Gmail account** (the one that receives mail for `nu@binaryheart.org`). The script reads that inbox, so it must run as this account.
2. Create a new Google Sheet, e.g. *BinaryHeart NU Mailing List*.
3. **Extensions → Apps Script**, delete the placeholder code, and paste in `apps-script/Code.gs`. Save.
4. Pick `setup` in the function dropdown and click **Run**. Approve the permissions (Sheets, Gmail, triggers). This:
   - creates the `Signups` tab with headers,
   - creates the Gmail label *Mailing List Signup*,
   - generates a random `SIGNUP_SECRET` (printed in the **Execution log** at the bottom; copy it),
   - installs a trigger that checks the inbox every 5 minutes.
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the web app URL (ends in `/exec`).

> If `nu@binaryheart.org` is a Google Group or alias that forwards to a personal Gmail, run the script from whichever account actually receives the mail.

### 2. Cloudflare Pages

From this `signup/` directory:

```bash
npx wrangler pages deploy
```

On first run it creates the `binaryheart-nu-join` project (→ `binaryheart-nu-join.pages.dev`). Then in the Cloudflare dashboard, go to **Workers & Pages → binaryheart-nu-join → Settings → Variables and Secrets** and add:

| Name | Value |
| --- | --- |
| `APPS_SCRIPT_URL` | The `/exec` URL from step 1.5 |
| `SIGNUP_SECRET` | The secret from the Apps Script log (mark it as a secret) |

Redeploy once after adding the variables.

**Optional: shorter URL for flyers.** If `binaryheart.org` DNS is on Cloudflare, add a custom domain like `join.binaryheart.org` under **Custom domains**. Then update `NU_SIGNUP_URL` in `src/pages/nu/Join.tsx` and the links above.

### 3. Optional tweaks

- **Cats on Campus button.** Set `CATS_ON_CAMPUS_URL` near the top of the script in `public/index.html`. A "Join us on Cats on Campus" button then appears after signup.
- **Confirmation emails.** `CONFIG.SEND_CONFIRMATION` in `Code.gs` (on by default). A short "you're on the list" email also helps people catch typos.
- **Subject line.** If you change `MAILTO_SUBJECT` in `index.html`, change `CONFIG.MAILTO_SUBJECT` in `Code.gs` to match. The inbox scan searches for that subject.

## Testing after setup

1. Open the page and submit your own Northwestern email. Within seconds a row appears in the Sheet with Method `web`.
2. Submit the same email again. The page says "already on the list" and no new row is added.
3. Tap **Join by email instead** and send it. Within 5 minutes a row appears with Method `email`, and the thread gets the *Mailing List Signup* label. To skip the wait, run `processMailtoSignups` by hand in Apps Script.

## Exporting for the real mailing list

Later, filter the Sheet to `Northwestern = TRUE` and copy the Email column into Cats on Campus, Google Groups, Mailchimp, etc. Rows marked *Needs Northwestern email* are people who haven't sent their Northwestern address yet.
