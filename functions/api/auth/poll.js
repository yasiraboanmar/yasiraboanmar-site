/**
 * Cloudflare Pages Function — /api/auth/poll
 * Polls GitHub for device flow token — no client_secret needed.
 */

const CLIENT_ID = 'Ov23li5dyo2zksIccBvn';

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const deviceCode = url.searchParams.get('device_code');

  if (!deviceCode) {
    return Response.json({ error: 'missing_device_code' }, { status: 400 });
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  });

  const data = await res.json();
  return Response.json(data);
}
