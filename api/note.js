// Reader notes to Mark and Paula. The page never shows their email address:
// the note goes to a Google Apps Script web app that saves it to a "Notes" tab
// and emails it to the Batorys (their address lives only inside that script).
// Env vars (set in Vercel): NOTES_WEBHOOK_URL, SIGNUP_SECRET
// Anything that trips the hidden spam-trap field is still saved, but flagged.

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

  const name = String(body.name || '').trim().slice(0, 150);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 5000);
  const trap = String(body._gotcha || '').trim();

  if (!name || !EMAIL_RE.test(email) || !message) {
    return res.status(400).json({ ok: false, error: 'Please enter your name, a valid email address and a message.' });
  }

  const reason = trap ? 'Hidden spam-trap field was filled in' : '';
  console.log('note', JSON.stringify({ name, email, length: message.length, flagged: Boolean(reason) }));

  if (!process.env.NOTES_WEBHOOK_URL || !process.env.SIGNUP_SECRET) {
    console.error('note failed: NOTES_WEBHOOK_URL or SIGNUP_SECRET is not set');
    return res.status(500).json({ ok: false, error: 'Something went wrong sending your note. Please try again in a moment.' });
  }

  try {
    const r = await fetch(process.env.NOTES_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: process.env.SIGNUP_SECRET, name, email, message, reason }),
      redirect: 'follow'
    });
    const text = await r.text();
    let data = {};
    try { data = JSON.parse(text); } catch (_) {}
    if (!r.ok || !data.ok) throw new Error('notes script responded ' + r.status + ': ' + text.slice(0, 200));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('note failed', err.message);
    return res.status(502).json({ ok: false, error: 'Something went wrong sending your note. Please try again in a moment.' });
  }
};
