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

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const query = `{
    viewer {
      accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
        rumWebsiteTagsAdaptiveGroups(
          filter: {
            AND: [
              {date_geq: "${today}"}
              {date_leq: "${today}"}
              {siteTag: "${SITE_TAG}"}
            ]
          }
          limit: 1
        ) {
          sum { visits pageViews }
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
    const groups = json?.data?.viewer?.accounts?.[0]?.rumWebsiteTagsAdaptiveGroups;

    if (groups && groups.length > 0) {
      const { visits, pageViews } = groups[0].sum;
      return Response.json({ visits, pageViews });
    }
    return Response.json({ visits: 0, pageViews: 0 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
