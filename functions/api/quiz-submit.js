/**
 * POST /api/quiz-submit
 * Saves a quiz attempt to Cloudflare D1.
 *
 * Required D1 setup (run once via Wrangler or Cloudflare Dashboard):
 *
 *   CREATE TABLE IF NOT EXISTS quiz_attempts (
 *     id               INTEGER PRIMARY KEY AUTOINCREMENT,
 *     quiz_id          TEXT    NOT NULL,
 *     name             TEXT,
 *     email            TEXT,
 *     score            INTEGER NOT NULL,
 *     total_questions  INTEGER NOT NULL,
 *     percentage       INTEGER NOT NULL,
 *     classification   TEXT    NOT NULL,
 *     lang             TEXT    NOT NULL DEFAULT 'ar',
 *     created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
 *   );
 *
 * Bind a D1 database named "DB" in your Cloudflare Pages project settings.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { quiz_id, name, email, score, total_questions, percentage, classification, lang } = body;

  if (!quiz_id || score == null || !total_questions || percentage == null || !classification) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO quiz_attempts
           (quiz_id, name, email, score, total_questions, percentage, classification, lang)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          String(quiz_id),
          name  ? String(name)  : null,
          email ? String(email) : null,
          Number(score),
          Number(total_questions),
          Number(percentage),
          String(classification),
          String(lang || 'ar')
        )
        .run();
    } catch (err) {
      return Response.json({ error: 'Database error', detail: err.message }, { status: 500 });
    }
  }

  return Response.json({ success: true });
}
