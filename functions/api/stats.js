/**
 * Cloudflare Pages Function — /api/stats
 * Returns today's visits and pageViews from Cloudflare Web Analytics.
 */

const ACCOUNT_ID = '0787d5cd4d1f323350688f98c13c54af';
const SITE_TAG   = 'e5d622910da64010a6e584ac2179f7bf';

export async function onRequestGet(context) {
  const token = (context.env.CF_ANALYTICS_TOKEN || '').trim();
  if (!token) {
    return Response.json({ error: 'CF_ANALYTICS_TOKEN not set' }, { status: 500 });
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now - 86400000).toISOString().split('T')[0];

  // Try flat filter (no AND wrapper) — some CF GraphQL datasets require this
  const query = `{
    viewer {
      accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
        rumWebsiteTagsAdaptiveGroups(
          filter: {
            siteTag: "${SITE_TAG}"
            date_geq: "${yesterday}"
            date_leq: "${today}"
          }
          limit: 10
          orderBy: [{date_DESC: true}]
        ) {
          sum { visits pageViews }
          dimensions { date }
        }
      }
    }
  }`;

  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const rows = json?.data?.viewer?.accounts?.[0]?.rumWebsiteTagsAdaptiveGroups ?? [];

    // Always expose raw response for diagnosis via ?debug=1
    const url = new URL(context.request.url);
    if (url.searchParams.get('debug') === '1') {
      return Response.json({ raw: json, today, yesterday, rows });
    }

    if (rows.length === 0) {
      return Response.json({ visits: 0, pageViews: 0, note: 'no_rows', today });
    }

    const todayRow = rows.find(r => r.dimensions?.date === today) ?? rows[0];
    const visits    = todayRow.sum?.visits    ?? 0;
    const pageViews = todayRow.sum?.pageViews ?? 0;

    return Response.json({ visits, pageViews, date: todayRow.dimensions?.date });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
