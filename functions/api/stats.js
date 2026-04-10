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
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD UTC
  // Also try yesterday in case of timezone lag
  const yesterday = new Date(now - 86400000).toISOString().split('T')[0];

  const query = `{
    viewer {
      accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
        rumWebsiteTagsAdaptiveGroups(
          filter: {
            AND: [
              {date_geq: "${yesterday}"}
              {date_leq: "${today}"}
              {siteTag: "${SITE_TAG}"}
            ]
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

    // Extract rows
    const rows = json?.data?.viewer?.accounts?.[0]?.rumWebsiteTagsAdaptiveGroups ?? [];

    if (rows.length === 0) {
      // Return debug info so we can diagnose
      return Response.json({ debug: json, today, yesterday, rows: [] });
    }

    // Find today's row first, fallback to first row
    const todayRow = rows.find(r => r.dimensions?.date === today) ?? rows[0];
    const visits    = todayRow.sum?.visits    ?? 0;
    const pageViews = todayRow.sum?.pageViews ?? 0;

    return Response.json({ visits, pageViews, date: todayRow.dimensions?.date });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
