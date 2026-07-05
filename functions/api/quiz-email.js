/**
 * POST /api/quiz-email
 * Sends quiz result to participant's email via Resend API.
 *
 * NOTE: Cloudflare Workers do NOT support direct TCP/SMTP connections.
 * Use Resend (resend.com) — free tier supports 3,000 emails/month.
 *
 * Setup:
 *  1. Sign up at resend.com and verify yasiraboanmar.com
 *  2. Create an API key
 *  3. Add it as a secret: wrangler pages secret put RESEND_API_KEY
 *  4. Set QUIZ_EMAIL_FROM as a secret or env var (e.g. noreply@yasiraboanmar.com)
 */

const FROM_DEFAULT = 'ياسر الجيادي <quiz@yasiraboanmar.com>';

function buildHtml({ name, quiz_title, score, total_questions, percentage, classification, motivation, lang }) {
  const isAr = lang === 'ar';
  const dir  = isAr ? 'rtl' : 'ltr';
  const greeting = name
    ? (isAr ? `مرحباً ${name}،` : `Hello ${name},`)
    : (isAr ? 'مرحباً،' : 'Hello,');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${isAr ? 'نتيجة اختبارك' : 'Your Quiz Result'}</title>
</head>
<body style="margin:0;padding:0;background:#060e09;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060e09;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0c1a0f;border:1px solid #1a3522;border-radius:14px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#102015;padding:24px 32px;border-bottom:1px solid #1a3522;">
            <p style="margin:0;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9ee6cf;">
              ${isAr ? 'نتيجة اختبار' : 'Quiz Result'}
            </p>
            <h1 style="margin:8px 0 0;font-size:1.2rem;color:#e8ede9;line-height:1.4;">
              ${quiz_title}
            </h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 20px;color:#7a9080;font-size:.95rem;">${greeting}</p>

            <!-- Score -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#102015;border:1px solid #1a3522;border-radius:10px;margin-bottom:20px;">
              <tr>
                <td style="padding:20px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#7a9080;">
                    ${isAr ? 'نتيجتك' : 'Your Score'}
                  </p>
                  <p style="margin:0;font-size:2.8rem;font-weight:800;color:#9ee6cf;line-height:1;">
                    ${score}<span style="font-size:1.8rem;color:#7a9080;"> / ${total_questions}</span>
                  </p>
                  <p style="margin:8px 0 0;font-size:1.3rem;font-weight:800;color:#9ee6cf;">
                    ${percentage}%
                  </p>
                </td>
              </tr>
            </table>

            <!-- Classification -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#102015;border:1px solid #1a3522;border-radius:10px;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#7a9080;">
                    ${isAr ? 'تقييمك' : 'Your Rating'}
                  </p>
                  <p style="margin:0;font-size:1.2rem;font-weight:800;color:#e8ede9;">${classification}</p>
                </td>
              </tr>
            </table>

            <!-- Motivation -->
            <p style="margin:0 0 24px;color:#7a9080;font-size:.93rem;line-height:1.8;font-style:italic;">
              ${motivation}
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td align="center" style="background:#1b7742;border-radius:10px;">
                  <a href="https://yasiraboanmar.com/${isAr ? 'quizzes' : 'en/quizzes'}/"
                     style="display:inline-block;padding:12px 28px;color:#e8ede9;font-weight:700;font-size:.95rem;text-decoration:none;">
                    ${isAr ? 'جرّب اختباراً آخر' : 'Try Another Quiz'}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #1a3522;">
            <p style="margin:0;font-size:.78rem;color:#7a9080;text-align:center;">
              yasiraboanmar.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = (env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    return Response.json({ error: 'Email service not configured (RESEND_API_KEY missing)' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { to_email, name, quiz_title, score, total_questions, percentage, classification, motivation, lang } = body;

  if (!to_email || !quiz_title) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const isAr    = lang === 'ar';
  const subject = isAr
    ? `نتيجة اختبارك — ${quiz_title}`
    : `Your Quiz Result — ${quiz_title}`;

  const from = (env.QUIZ_EMAIL_FROM || '').trim() || FROM_DEFAULT;

  const html = buildHtml({ name, quiz_title, score, total_questions, percentage, classification, motivation, lang });

  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to_email], subject, html }),
    });
  } catch (err) {
    return Response.json({ error: 'Network error', detail: err.message }, { status: 502 });
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return Response.json({ error: 'Resend API error', detail }, { status: 502 });
  }

  return Response.json({ success: true });
}
