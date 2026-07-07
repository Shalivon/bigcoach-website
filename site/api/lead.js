// Vercel serverless function — receives submissions from the lead form and the
// discount popup (both now POST here instead of talking to Google Sheets directly
// from the browser). Currently logs every lead to Vercel's function logs.
//
// To wire in a real destination, set environment variables in the Vercel project
// (Settings → Environment Variables) — no code changes needed:
//   GOOGLE_SHEETS_WEBHOOK_URL   Apps Script "Web App" URL, if using a Sheet as the CRM
//   CRM_WEBHOOK_URL             Any CRM's inbound webhook URL (HubSpot, GoHighLevel, etc.)
//
// WhatsApp Business API sending (auto-reply, notify Golan, follow-ups) is not wired
// yet — it needs a provider account (Twilio / 360dialog / Wati) and its credentials
// as env vars before a request can be added here.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (_) { body = {}; }
  }

  const {
    name = '',
    phone = '',
    goal = '',
    discount = false,
    source = 'bigcoach-website',
    ts = new Date().toISOString(),
  } = body || {};

  const cleanPhone = String(phone).replace(/\D/g, '');
  if (cleanPhone.length < 9) {
    res.status(400).json({ ok: false, error: 'invalid phone' });
    return;
  }

  const lead = {
    name: String(name).trim(),
    phone: cleanPhone,
    goal: String(goal).trim(),
    discount: !!discount,
    source,
    ts,
  };

  console.log('[lead]', JSON.stringify(lead));

  const destinations = [process.env.GOOGLE_SHEETS_WEBHOOK_URL, process.env.CRM_WEBHOOK_URL].filter(Boolean);

  await Promise.all(destinations.map(url =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch(err => console.error('[lead] forward failed:', url, err))
  ));

  res.status(200).json({ ok: true });
};
