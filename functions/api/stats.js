/**
 * Cloudflare Pages Function — /api/stats
 * Returns today's visits and pageViews from Cloudflare Web Analytics.
 */

const ACCOUNT_ID = '0787d5cd4d1f323350688f98c13c54af';
const SITE_TAG   = 'e5d622910da64010a6e584ac2179f7bf';

async function gql(token, query) {
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export async function onRequestGet(context) {
  const token = (context.env.CF_ANALYTICS_TOKEN || '').trim();
  if (!token) return Response.json({ error: 'CF_ANALYTICS_TOKEN not set' }, { status: 500 });

  const url = new URL(context.request.url);

  // ?debug=schema  → discover available fields via full introspection
  if (url.searchParams.get('debug') === 'schema') {
    const introspect = `{
      __schema {
        queryType { name fields { name } }
        types { name kind }
      }
    }`;
    const json = await gql(token, introspect);
    // Extract only type names with "rum" or "analytic" in them (case insensitive)
    const allTypes = json?.data?.__schema?.types ?? [];
    const rumTypes = allTypes.filter(t => /rum|analytic|web/i.test(t.name));
    const queryFields = json?.data?.__schema?.queryType?.fields ?? [];
    return Response.json({ queryFields, rumTypes, raw: json?.errors });
  }

  const now = new Date();
  const today     = now.toISOString().split('T')[0];
  const yesterday = new Date(now - 86400000).toISOString().split('T')[0];

  const query = `{
    viewer {
      accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
        rumWebsiteEventsAdaptiveGroups(
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
    const json = await gql(token, query);

    if (url.searchParams.get('debug') === '1') {
      return Response.json({ raw: json, today, yesterday });
    }

    const rows = json?.data?.viewer?.accounts?.[0]?.rumWebsiteEventsAdaptiveGroups ?? [];
    if (rows.length === 0) return Response.json({ visits: 0, pageViews: 0, today });

    const todayRow  = rows.find(r => r.dimensions?.date === today) ?? rows[0];
    return Response.json({
      visits:    todayRow.sum?.visits    ?? 0,
      pageViews: todayRow.sum?.pageViews ?? 0,
      date:      todayRow.dimensions?.date,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
