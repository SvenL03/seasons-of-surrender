// Signup endpoint: saves each signup to the Google Sheet via its Apps Script web app.
// Env vars (set in Vercel): SHEET_WEBHOOK_URL, SIGNUP_SECRET
// Nobody is rejected for looking like spam: anything that trips the hidden
// spam-trap field is saved to the "Possible spam" tab instead of "Signups".

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const firstName = String(body.firstName || '').trim().slice(0, 100);
  const lastName = String(body.lastName || '').trim().slice(0, 100);
  const email = String(body.email || '').trim().slice(0, 200);
  const trap = String(body._gotcha || '').trim();

  if (!firstName || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter your first name and a valid email address.' });
  }

  const reason = trap ? 'Hidden spam-trap field was filled in' : '';

  // Backup copy in Vercel's logs in case the sheet is ever unreachable.
  console.log('signup', JSON.stringify({ firstName, email, flagged: Boolean(reason) }));

  if (!process.env.SHEET_WEBHOOK_URL || !process.env.SIGNUP_SECRET) {
    console.error('signup failed: SHEET_WEBHOOK_URL or SIGNUP_SECRET is not set');
    return res.status(500).json({ ok: false, error: 'Something went wrong saving your email. Please try again in a moment.' });
  }

  try {
    const r = await fetch(process.env.SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: process.env.SIGNUP_SECRET,
        firstName,
        email,
        reason,
        userAgent: String(req.headers['user-agent'] || '').slice(0, 300)
      }),
      redirect: 'follow'
    });
    const text = await r.text();
    let data = {};
    try { data = JSON.parse(text); } catch (_) {}
    if (!r.ok || !data.ok) throw new Error('sheet responded ' + r.status + ': ' + text.slice(0, 200));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('signup failed', err.message);
    return res.status(502).json({ ok: false, error: 'Something went wrong saving your email. Please try again in a moment.' });
  }
};
