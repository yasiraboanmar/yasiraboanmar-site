/**
 * Cloudflare Pages Function — /api/auth
 * GitHub Device Flow — no client_secret needed.
 */

const CLIENT_ID = 'Ov23li5dyo2zksIccBvn';

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');

  if (provider !== 'github') {
    return new Response('Unknown provider', { status: 400 });
  }

  try {
    const res = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, scope: 'repo user' }),
    });

    const { device_code, user_code, verification_uri_complete, verification_uri, expires_in, interval } = await res.json();
    const authUrl = verification_uri_complete || `${verification_uri}?user_code=${user_code}`;
    const pollInterval = (interval || 5) * 1000;
    const pollUrl = `/api/auth/poll?device_code=${encodeURIComponent(device_code)}`;

    return new Response(`<!doctype html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<title>تسجيل الدخول - GitHub</title>
<style>
  body { font-family: sans-serif; max-width: 420px; margin: 40px auto; text-align: center; color: #333; padding: 0 16px; }
  h2 { font-size: 1.3em; }
  .code { font-size: 2em; font-weight: bold; letter-spacing: .25em; background: #f4f4f4; padding: 14px 20px; border-radius: 8px; margin: 16px 0; font-family: monospace; direction: ltr; }
  .btn { display: inline-block; background: #238636; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-size: 1em; margin-top: 8px; }
  .status { margin-top: 20px; color: #666; font-size: .95em; }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #ccc; border-top-color: #333; border-radius: 50%; animation: spin .8s linear infinite; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
  <h2>تسجيل الدخول عبر GitHub</h2>
  <p>أدخل هذا الرمز في صفحة GitHub:</p>
  <div class="code">${user_code}</div>
  <a class="btn" href="${authUrl}" target="_blank" id="openBtn">فتح GitHub لإدخال الرمز</a>
  <div class="status" id="status"><span class="spinner"></span> جاري الانتظار...</div>

  <script>
    var pollUrl = ${JSON.stringify(pollUrl)};
    var pollInterval = ${pollInterval};
    var expires = Date.now() + ${(expires_in || 900) * 1000};

    // Auto-open GitHub authorization page
    window.open(${JSON.stringify(authUrl)}, '_blank');

    function poll() {
      if (Date.now() > expires) {
        document.getElementById('status').textContent = 'انتهت صلاحية الرمز — أغلق هذه النافذة وحاول مجدداً.';
        return;
      }
      fetch(pollUrl)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.access_token) {
            document.getElementById('status').textContent = 'تم التفويض! جاري تسجيل الدخول...';
            var msg = JSON.stringify({ token: data.access_token, provider: 'github' });
            window.opener.postMessage('authorization:github:success:' + msg, '*');
            setTimeout(function() { window.close(); }, 1000);
          } else if (data.error === 'slow_down') {
            pollInterval += 5000;
            setTimeout(poll, pollInterval);
          } else if (data.error === 'authorization_pending' || !data.error) {
            setTimeout(poll, pollInterval);
          } else {
            document.getElementById('status').textContent = 'خطأ: ' + (data.error_description || data.error);
          }
        })
        .catch(function() { setTimeout(poll, pollInterval); });
    }

    setTimeout(poll, pollInterval);
  </script>
</body>
</html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  } catch (err) {
    return new Response('<p>Server error: ' + err.message + '</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 500,
    });
  }
}
