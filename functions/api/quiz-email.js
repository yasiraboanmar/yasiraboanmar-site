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
 *  4. Set QUIZ_EMAIL_FROM as a secret or env var (e.g. quiz@yasiraboanmar.com)
 */

const FROM_DEFAULT = 'ياسر الجيادي <quiz@yasiraboanmar.com>';

function buildHtml({ name, quiz_title, score, total_questions, percentage, classification, motivation, lang }) {
  const isAr = lang === 'ar';
  const dir  = isAr ? 'rtl' : 'ltr';

  const logoUrl       = 'https://yasiraboanmar.com/YAA-white.svg';
  const quizzesUrl    = 'https://yasiraboanmar.com/' + (isAr ? 'quizzes' : 'en/quizzes') + '/';
  const ctaLabel      = isAr ? 'جرّب اختبارًا آخر' : 'Try Another Quiz';
  const footerNote    = isAr
    ? 'هذا البريد أُرسل بناءً على طلبك من صفحة نتيجة الاختبار على yasiraboanmar.com'
    : 'This email was sent at your request from the quiz result page on yasiraboanmar.com';
  const eyebrowLabel  = isAr ? 'شهادة اجتياز اختبار' : 'Certificate of Completion';
  const grantsLabel   = isAr ? 'تُمنح هذه الشهادة إلى' : 'This certificate is awarded to';
  const completedText = isAr
    ? 'عن إتمام اختبار «' + quiz_title + '» بنجاح'
    : 'for completing the quiz "' + quiz_title + '" successfully';
  const scoreLabel    = isAr ? 'النتيجة' : 'Score';
  const pctLabel      = isAr ? 'النسبة' : 'Percentage';
  const participantName = name || (isAr ? 'مشارك' : 'Participant');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${isAr ? 'شهادة اجتياز اختبار' : 'Certificate of Completion'}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef1ef;font-family:'Cairo',Tahoma,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef1ef;padding:32px 12px;">
  <tr>
    <td align="center">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background-color:#0b1f1c;border-radius:18px;overflow:hidden;">

        <!-- Brand strip with logo -->
        <tr>
          <td align="center" style="padding:28px 24px 10px;">
            <img src="${logoUrl}" alt="${isAr ? 'ياسر الجيادي' : 'Yasir Aljiyadi'}"
              height="40" style="display:block;margin:0 auto 8px;border:0;" />
            <div style="color:#9ee6cf;font-size:12px;letter-spacing:.06em;font-weight:600;
              font-family:'Cairo',Tahoma,Arial,sans-serif;">yasiraboanmar.com</div>
          </td>
        </tr>

        <!-- Certificate card -->
        <tr>
          <td style="padding:8px 20px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="background-color:#123329;border-radius:16px;border:1px solid rgba(158,230,207,0.22);">

              <!-- Quiz title area -->
              <tr>
                <td align="center" style="padding:36px 28px 8px;">
                  <div style="color:#e8c468;font-size:12px;font-weight:700;letter-spacing:.1em;margin-bottom:8px;
                    font-family:'Cairo',Tahoma,Arial,sans-serif;">${eyebrowLabel}</div>
                  <div style="color:#f2f7f4;font-size:22px;font-weight:900;line-height:1.4;
                    font-family:'Cairo',Tahoma,Arial,sans-serif;">${quiz_title}</div>
                </td>
              </tr>

              <!-- Grants / participant name -->
              <tr>
                <td align="center" style="padding:18px 28px 0;">
                  <div style="color:#cfe9df;font-size:13px;margin-bottom:8px;
                    font-family:'Cairo',Tahoma,Arial,sans-serif;">${grantsLabel}</div>
                  <div style="color:#ffffff;font-size:28px;font-weight:800;
                    font-family:'Cairo',Tahoma,Arial,sans-serif;
                    border-bottom:2px solid rgba(232,196,104,0.3);
                    display:inline-block;padding-bottom:10px;margin-bottom:16px;">${participantName}</div>
                </td>
              </tr>

              <!-- Completed text -->
              <tr>
                <td align="center" style="padding:0 28px 22px;">
                  <div style="color:#cfe9df;font-size:13px;line-height:1.8;
                    font-family:'Cairo',Tahoma,Arial,sans-serif;">${completedText}</div>
                </td>
              </tr>

              <!-- Score row: Score | Seal | Percentage -->
              <tr>
                <td align="center" style="padding:0 16px 28px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <!-- Score -->
                      <td align="center" style="padding:0 20px;">
                        <div style="color:#ffffff;font-size:28px;font-weight:900;
                          font-family:'Cairo',Tahoma,Arial,sans-serif;">${score}/${total_questions}</div>
                        <div style="color:#6fb6a0;font-size:11px;margin-top:3px;
                          font-family:'Cairo',Tahoma,Arial,sans-serif;">${scoreLabel}</div>
                      </td>
                      <!-- Divider -->
                      <td style="width:1px;background-color:rgba(232,196,104,0.28);">&nbsp;</td>
                      <!-- Seal -->
                      <td align="center" style="padding:0 20px;">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" valign="middle"
                              style="width:80px;height:80px;border-radius:40px;
                                border:2px solid #e8c468;
                                background-color:rgba(232,196,104,0.08);
                                text-align:center;vertical-align:middle;">
                              <div style="color:#f2f7f4;font-size:13px;font-weight:800;
                                font-family:'Cairo',Tahoma,Arial,sans-serif;">${classification}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <!-- Divider -->
                      <td style="width:1px;background-color:rgba(232,196,104,0.28);">&nbsp;</td>
                      <!-- Percentage -->
                      <td align="center" style="padding:0 20px;">
                        <div style="color:#ffffff;font-size:28px;font-weight:900;
                          font-family:'Cairo',Tahoma,Arial,sans-serif;">${percentage}%</div>
                        <div style="color:#6fb6a0;font-size:11px;margin-top:3px;
                          font-family:'Cairo',Tahoma,Arial,sans-serif;">${pctLabel}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Motivation message -->
              <tr>
                <td align="center" style="padding:0 30px 32px;">
                  <div style="color:#cfe9df;font-size:13px;line-height:1.9;
                    font-family:'Cairo',Tahoma,Arial,sans-serif;">${motivation}</div>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- CTA button -->
        <tr>
          <td align="center" style="padding:0 24px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="background-color:#9ee6cf;border-radius:10px;">
                  <a href="${quizzesUrl}"
                    style="display:inline-block;padding:13px 32px;
                      color:#0b1f1c;font-family:'Cairo',Tahoma,Arial,sans-serif;
                      font-weight:700;font-size:14px;text-decoration:none;">${ctaLabel}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center"
            style="padding:16px 24px 24px;border-top:1px solid rgba(158,230,207,0.1);">
            <div style="color:#6fb6a0;font-size:11px;line-height:1.8;
              font-family:'Cairo',Tahoma,Arial,sans-serif;">${footerNote}</div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
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
    ? `شهادة اجتياز اختبار — ${quiz_title}`
    : `Certificate of Completion — ${quiz_title}`;

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
