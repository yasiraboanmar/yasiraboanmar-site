const QUIZ_OG_IMAGES = [
  '/images/quizzes/law-quiz-1.png',
  '/images/quizzes/law-quiz-2.png',
  '/images/quizzes/law-quiz-3.png',
];

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (!/^\/(?:en\/)?quizzes(\/|$)/.test(path)) {
    return next();
  }

  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();
  const baseUrl = `${url.protocol}//${url.host}`;
  const idx = Math.floor(Math.random() * QUIZ_OG_IMAGES.length);
  const img = baseUrl + QUIZ_OG_IMAGES[idx];

  html = html
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"/,
      `<meta property="og:image" content="${img}"`
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"/,
      `<meta name="twitter:image" content="${img}"`
    );

  const newHeaders = new Headers(response.headers);
  newHeaders.set('content-type', 'text/html; charset=utf-8');

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
