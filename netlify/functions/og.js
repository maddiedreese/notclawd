// Netlify serverless function for OG image generation
// Uses @napi-rs/canvas for server-side rendering

export default async (req) => {
  const url = new URL(req.url);
  const config = url.searchParams.get('config') || 'FF6B4A-0-0-0-0-0';

  const parts = config.split('-');
  if (parts.length !== 6) {
    return new Response('Invalid config', { status: 400 });
  }

  const color = parts[0];
  const [spikes, eyes, mouth, head, held] = parts.slice(1).map(Number);

  // Dynamic import for canvas (only available in Netlify functions)
  let createCanvas;
  try {
    const canvas = await import('@napi-rs/canvas');
    createCanvas = canvas.createCanvas;
  } catch {
    // Fallback: return a simple SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect fill="#0a0a0a" width="1200" height="630"/>
      <text fill="#FF6B4A" font-family="monospace" font-size="48" x="600" y="300" text-anchor="middle">Not Claw'd</text>
      <text fill="#666" font-family="monospace" font-size="24" x="600" y="350" text-anchor="middle">definitely not official</text>
    </svg>`;
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
    });
  }

  const c = createCanvas(1200, 630);
  const ctx = c.getContext('2d');

  // Dark background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, 1200, 630);

  // For now, render a simple representation
  // In production, import the layer data and composite properly
  ctx.fillStyle = '#FF6B4A';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText("Not Claw'd", 600, 80);

  ctx.fillStyle = '#666';
  ctx.font = '24px monospace';
  ctx.fillText('definitely not official', 600, 120);

  // Draw a simple colored circle as the body
  ctx.fillStyle = `#${color}`;
  ctx.beginPath();
  ctx.arc(600, 350, 120, 0, Math.PI * 2);
  ctx.fill();

  // Simple eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(565, 330, 18, 0, Math.PI * 2);
  ctx.arc(635, 330, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(570, 330, 10, 0, Math.PI * 2);
  ctx.arc(640, 330, 10, 0, Math.PI * 2);
  ctx.fill();

  // Simple smile
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(600, 370, 30, 0.2, Math.PI - 0.2);
  ctx.stroke();

  const buffer = c.toBuffer('image/png');
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};

export const config = {
  path: '/.netlify/functions/og',
};
