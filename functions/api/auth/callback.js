/**
 * /api/auth/callback — not used with Device Flow.
 * Kept as fallback in case GitHub redirects here.
 */

export async function onRequestGet() {
  return new Response(
    `<!doctype html><html><body>
      <p>هذه الصفحة غير مستخدمة. أغلق النافذة.</p>
      <script>window.close();</script>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
