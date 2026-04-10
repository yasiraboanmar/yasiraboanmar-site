/**
 * Cloudflare Pages Function — /api/auth/callback
 * Exchanges GitHub OAuth code for token and sends it to Decap CMS.
 */

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return html('<p>Error: no code from GitHub.</p>');
    }

    const clientId = (env.GH_CLIENT_ID || '').trim();
    const clientSecret = (env.GH_CLIENT_SECRET || '').trim();

    if (!clientId || !clientSecret) {
      const keys = Object.keys(env).join(', ');
      return html(
        `<p>Config error:<br>` +
        `GH_CLIENT_ID: ${clientId ? 'OK' : 'MISSING'}<br>` +
        `GH_CLIENT_SECRET: ${clientSecret ? 'OK' : 'MISSING'}<br>` +
        `Available keys: ${keys}</p>`
      );
    }

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const data = await res.json();

    if (data.error) {
      return html(`<p>OAuth error: ${data.error_description || data.error}</p>`);
    }

    const token = data.access_token;
    return html(`<script>
      (function() {
        var msg = JSON.stringify({ token: ${JSON.stringify(token)}, provider: 'github' });
        function send(e) {
          window.opener.postMessage('authorization:github:success:' + msg, e.origin);
        }
        window.addEventListener('message', send, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>`);

  } catch (err) {
    return html(`<p>Server error: ${err.message}</p>`);
  }
}

function html(content) {
  return new Response(`<!doctype html><html><body>${content}</body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
