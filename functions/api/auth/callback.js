/**
 * Cloudflare Pages Function — /api/auth/callback
 * Exchanges GitHub OAuth code for access token, then sends it to Decap CMS.
 */

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return htmlResponse('<p>Error: no authorization code received from GitHub.</p>');
    }

    const clientId = (env.KEYSTATIC_GITHUB_CLIENT_ID || '').trim();
    const clientSecret = (env.KEYSTATIC_GITHUB_CLIENT_SECRET || '').trim();

    if (!clientId || !clientSecret) {
      return htmlResponse(
        `<p>Config error: env vars missing.<br>` +
        `KEYSTATIC_GITHUB_CLIENT_ID: ${clientId ? 'OK' : 'MISSING'}<br>` +
        `KEYSTATIC_GITHUB_CLIENT_SECRET: ${clientSecret ? 'OK' : 'MISSING'}</p>`
      );
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      const msg = tokenData.error_description || tokenData.error;
      return htmlResponse(`<p>OAuth error: ${msg}</p>`);
    }

    const token = tokenData.access_token;

    // Decap CMS listens for this postMessage format in the popup window
    const script = `
      <script>
        (function() {
          var token = ${JSON.stringify(token)};
          var message = JSON.stringify({ token: token, provider: 'github' });
          function sendToken(e) {
            window.opener.postMessage(
              'authorization:github:success:' + message,
              e.origin
            );
          }
          window.addEventListener('message', sendToken, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      </script>
    `;

    return htmlResponse(script);

  } catch (err) {
    return htmlResponse(`<p>Server error: ${err.message}</p>`);
  }
}

function htmlResponse(content) {
  return new Response(`<!doctype html><html><body>${content}</body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
