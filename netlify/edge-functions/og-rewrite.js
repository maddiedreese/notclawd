// Edge function that rewrites the OG meta tags for shared custom Claw'd URLs.
// Handles paths like /c/FF6B4A-0-0-0-0-0 — serves the SPA but with the
// correct og:image pointing to the OG image generator function.

export default async (request, context) => {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/c\/([A-Fa-f0-9]{6}-\d-\d-\d-\d-\d)$/);

  if (!match) {
    return context.next();
  }

  const config = match[1];
  const isDefault = config === 'FF6B4A-0-0-0-0-0';

  // Fetch the original index.html
  const response = await context.next();
  const html = await response.text();

  const ogImageUrl = isDefault
    ? 'https://notclawd.sh/og.png'
    : `https://notclawd.sh/.netlify/functions/og?config=${config}`;

  // Replace the OG image URLs in the HTML
  const rewritten = html
    .replace(
      /content="https:\/\/notclawd\.sh\/og\.png"/g,
      `content="${ogImageUrl}"`
    );

  return new Response(rewritten, {
    headers: {
      ...Object.fromEntries(response.headers),
      'content-type': 'text/html; charset=utf-8',
    },
  });
};

export const config = {
  path: '/c/*',
};
