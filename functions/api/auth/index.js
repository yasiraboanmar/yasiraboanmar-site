/**
 * Cloudflare Pages Function — /api/auth
 * Redirects to GitHub OAuth authorization page.
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.searchParams.get('provider') !== 'github') {
    return new Response('Unknown provider', { status: 400 });
  }

  const clientId = (env.GH_CLIENT_ID || '').trim();
  if (!clientId) {
    return new Response('Config error: GH_CLIENT_ID not set', { status: 500 });
  }

  const redirectUri = new URL('/api/auth/callback', url.origin).toString();
  const githubUrl = new URL('https://github.com/login/oauth/authorize');
  githubUrl.searchParams.set('client_id', clientId);
  githubUrl.searchParams.set('redirect_uri', redirectUri);
  githubUrl.searchParams.set('scope', 'repo user');

  return Response.redirect(githubUrl.toString(), 302);
}
