/**
 * Protects /admin/* with HTTP Basic Auth.
 * Set ADMIN_PASSWORD env var in Cloudflare Pages → Settings → Variables and Secrets.
 * Username: admin (anything works)
 * Password: value of ADMIN_PASSWORD
 */

export async function onRequest(context) {
  const { request, env } = context;
  const password = (env.ADMIN_PASSWORD || '').trim();

  if (!password) {
    // No password set — block access entirely
    return new Response('Admin access not configured.', { status: 503 });
  }

  const auth = request.headers.get('Authorization') || '';

  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const colonIndex = decoded.indexOf(':');
      const inputPassword = colonIndex >= 0 ? decoded.slice(colonIndex + 1) : '';
      if (inputPassword === password) {
        return context.next(); // correct password — serve the page
      }
    } catch {}
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Blog Admin", charset="UTF-8"' },
  });
}
