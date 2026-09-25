/**
 * POST /api/join  { email, source, website }
 *
 * Validates a Northwestern email and forwards it to the Google Apps Script
 * web app, which appends it to the signup Google Sheet.
 *
 * Environment variables (Cloudflare Pages → Settings → Variables and Secrets):
 *   APPS_SCRIPT_URL  The Apps Script web app URL (ends in /exec)
 *   SIGNUP_SECRET    Shared secret; must match SIGNUP_SECRET in the script's properties
 */

const DEFAULT_DOMAIN = 'u.northwestern.edu';
const NU_EMAIL = /^[a-z0-9._%+'-]+@(u\.)?northwestern\.edu$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export function normalizeEmail(raw) {
  let email = String(raw || '').trim().toLowerCase().replace(/^mailto:/, '').replace(/\s+/g, '');
  if (email && !email.includes('@')) email += `@${DEFAULT_DOMAIN}`;
  return email;
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot filled in: pretend it worked so bots move on.
  if (data.website) return json({ ok: true });

  const email = normalizeEmail(data.email);
  if (email.length > 254 || !NU_EMAIL.test(email)) {
    return json({ ok: false, error: 'not_northwestern' }, 422);
  }

  if (!env.APPS_SCRIPT_URL || !env.SIGNUP_SECRET) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const source = String(data.source || 'web').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'web';

  try {
    // Apps Script answers with a 302 to googleusercontent.com; fetch follows it.
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.SIGNUP_SECRET, email, source, method: 'web' }),
    });
    const result = await res.json();
    if (!result.ok) throw new Error(result.error || 'apps_script_error');
    return json({ ok: true, duplicate: !!result.duplicate });
  } catch (err) {
    console.error('Signup forward failed:', err);
    return json({ ok: false, error: 'upstream' }, 502);
  }
}
