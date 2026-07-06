export async function onRequestGet(context) {
  const { env } = context;

  if (!env.DB) {
    return Response.json({});
  }

  try {
    const result = await env.DB
      .prepare('SELECT quiz_id, COUNT(*) AS cnt FROM quiz_attempts GROUP BY quiz_id')
      .all();

    const counts = {};
    for (const row of result.results) {
      counts[row.quiz_id] = row.cnt;
    }

    return Response.json(counts);
  } catch (_) {
    return Response.json({});
  }
}
