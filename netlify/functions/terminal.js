// Netlify function that returns an ANSI terminal command for a given Claw'd config.
// Usage: curl -s notclawd.com/t/FF6B4A-0-0-0-0-0 | bash
//
// This duplicates the layer compositing logic from the client so we don't
// need to bundle the full React app server-side.

function rect(x0, y0, w, h, color) {
  const pixels = [];
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) pixels.push({ x, y, color });
  return pixels;
}

// ─── Minimal layer data (same as src/data/layers.js) ───

const BASE_BODY = [
  ...rect(6, 6, 20, 4, 'body'),
  ...rect(6, 10, 3, 4, 'body'),
  ...rect(11, 10, 10, 4, 'body'),
  ...rect(23, 10, 3, 4, 'body'),
  ...rect(2, 14, 28, 4, 'body'),
  ...rect(6, 18, 20, 4, 'body'),
  ...rect(8, 22, 2, 4, 'body'),
  ...rect(12, 22, 2, 4, 'body'),
  ...rect(18, 22, 2, 4, 'body'),
  ...rect(22, 22, 2, 4, 'body'),
];

const FILL_EYE_CUTOUTS = [
  ...rect(9, 10, 2, 4, 'body'),
  ...rect(21, 10, 2, 4, 'body'),
];

const SPIKE_OPTIONS = [
  [], // 0: Default
  [ // 1: Flame tips
    ...rect(8, 4, 3, 2, '#FF8C00'), ...rect(14, 3, 4, 3, '#FF4500'), ...rect(22, 4, 3, 2, '#FF8C00'),
    { x: 9, y: 3, color: '#FFD700' }, { x: 15, y: 2, color: '#FFD700' }, { x: 16, y: 2, color: '#FFD700' }, { x: 23, y: 3, color: '#FFD700' },
  ],
  [ // 2: Rainbow
    ...rect(6, 4, 3, 2, '#FF0000'), ...rect(9, 4, 3, 2, '#FF8C00'), ...rect(12, 4, 3, 2, '#FFD700'),
    ...rect(15, 4, 3, 2, '#00C853'), ...rect(18, 4, 3, 2, '#2979FF'), ...rect(21, 4, 3, 2, '#7C4DFF'), ...rect(24, 4, 2, 2, '#FF1493'),
  ],
  [ // 3: Bedhead
    ...rect(7, 4, 2, 2, 'body'), ...rect(12, 3, 3, 3, 'body'), ...rect(18, 2, 2, 4, 'body'),
    ...rect(23, 4, 3, 2, 'body'), ...rect(10, 5, 2, 1, 'body'), ...rect(16, 4, 2, 2, 'body'),
  ],
  [ // 4: Crown
    ...rect(6, 4, 20, 2, '#FFD700'), ...rect(7, 2, 2, 2, '#FFD700'), ...rect(15, 1, 2, 3, '#FFD700'), ...rect(23, 2, 2, 2, '#FFD700'),
    ...rect(6, 5, 20, 1, '#B8860B'),
    { x: 8, y: 3, color: '#FF0000' }, { x: 15, y: 2, color: '#4169E1' }, { x: 16, y: 2, color: '#4169E1' }, { x: 23, y: 3, color: '#FF0000' },
  ],
  [ // 5: Mohawk
    ...rect(14, 3, 4, 3, 'body'), ...rect(15, 1, 2, 2, 'body'),
  ],
  [ // 6: Antenna
    ...[2,3,4,5].flatMap(y => [{ x: 11, y, color: 'body' }, { x: 20, y, color: 'body' }]),
    { x: 10, y: 1, color: '#FFD700' }, { x: 11, y: 1, color: '#FFD700' }, { x: 12, y: 1, color: '#FFD700' }, { x: 11, y: 0, color: '#FFD700' },
    { x: 19, y: 1, color: '#FFD700' }, { x: 20, y: 1, color: '#FFD700' }, { x: 21, y: 1, color: '#FFD700' }, { x: 20, y: 0, color: '#FFD700' },
  ],
  [ // 7: Horns
    ...rect(7, 4, 3, 2, '#C62828'), ...rect(8, 2, 2, 2, '#C62828'), { x: 9, y: 1, color: '#C62828' },
    ...rect(22, 4, 3, 2, '#C62828'), ...rect(22, 2, 2, 2, '#C62828'), { x: 22, y: 1, color: '#C62828' },
  ],
];

const EYE_OPTIONS = [
  [], // 0: Default (empty cutouts)
  [ // 1: Heart eyes
    ...FILL_EYE_CUTOUTS,
    { x: 8, y: 10, color: '#FF1493' }, { x: 10, y: 10, color: '#FF1493' },
    { x: 8, y: 11, color: '#FF1493' }, { x: 9, y: 11, color: '#FF1493' }, { x: 10, y: 11, color: '#FF1493' },
    { x: 9, y: 12, color: '#FF1493' },
    { x: 21, y: 10, color: '#FF1493' }, { x: 23, y: 10, color: '#FF1493' },
    { x: 21, y: 11, color: '#FF1493' }, { x: 22, y: 11, color: '#FF1493' }, { x: 23, y: 11, color: '#FF1493' },
    { x: 22, y: 12, color: '#FF1493' },
  ],
  [ ...FILL_EYE_CUTOUTS, ...rect(8, 11, 4, 1, '#1a1a1a'), ...rect(8, 12, 4, 1, '#1a1a1a'), ...rect(20, 11, 4, 1, '#1a1a1a'), ...rect(20, 12, 4, 1, '#1a1a1a') ], // 2: Sleepy
  [ // 3: X_X
    ...FILL_EYE_CUTOUTS,
    { x: 8, y: 10, color: '#1a1a1a' }, { x: 10, y: 10, color: '#1a1a1a' }, { x: 9, y: 11, color: '#1a1a1a' }, { x: 8, y: 12, color: '#1a1a1a' }, { x: 10, y: 12, color: '#1a1a1a' },
    { x: 21, y: 10, color: '#1a1a1a' }, { x: 23, y: 10, color: '#1a1a1a' }, { x: 22, y: 11, color: '#1a1a1a' }, { x: 21, y: 12, color: '#1a1a1a' }, { x: 23, y: 12, color: '#1a1a1a' },
  ],
  [ // 4: Sparkle
    ...FILL_EYE_CUTOUTS,
    { x: 9, y: 9, color: '#FFD700' }, { x: 8, y: 11, color: '#FFD700' }, { x: 9, y: 11, color: '#FFFFFF' }, { x: 10, y: 11, color: '#FFD700' }, { x: 9, y: 13, color: '#FFD700' }, { x: 7, y: 11, color: '#FFD700' }, { x: 11, y: 11, color: '#FFD700' },
    { x: 22, y: 9, color: '#FFD700' }, { x: 23, y: 11, color: '#FFD700' }, { x: 22, y: 11, color: '#FFFFFF' }, { x: 21, y: 11, color: '#FFD700' }, { x: 22, y: 13, color: '#FFD700' }, { x: 24, y: 11, color: '#FFD700' }, { x: 20, y: 11, color: '#FFD700' },
  ],
  [ // 5: Cyclops
    ...FILL_EYE_CUTOUTS, ...rect(14, 10, 4, 4, '#FFFFFF'), ...rect(15, 11, 2, 2, '#1a1a1a'),
  ],
  [ // 6: Wink
    ...rect(21, 10, 2, 4, 'body'), ...rect(20, 11, 4, 1, '#1a1a1a'),
  ],
  [ // 7: Shades
    ...FILL_EYE_CUTOUTS, ...rect(7, 10, 6, 3, '#1a1a1a'), ...rect(13, 11, 6, 1, '#1a1a1a'), ...rect(19, 10, 6, 3, '#1a1a1a'),
    { x: 8, y: 10, color: '#4444FF' }, { x: 20, y: 10, color: '#4444FF' },
  ],
];

const MOUTH_OPTIONS = [
  [], // 0
  [ ...rect(13, 18, 6, 2, '#1a1a1a'), ...rect(14, 18, 4, 1, '#C62828') ], // 1: Excited
  [ ...rect(13, 18, 6, 1, '#1a1a1a'), ...rect(15, 19, 2, 2, '#FF4D6D') ], // 2: Tongue
  [ ...rect(12, 18, 8, 1, '#1a1a1a') ], // 3: Flat
  [ ...rect(14, 18, 5, 1, '#1a1a1a'), { x: 19, y: 17, color: '#1a1a1a' } ], // 4: Smirk
  [ ...rect(13, 18, 6, 1, '#1a1a1a'), { x: 14, y: 19, color: '#FFFFFF' }, { x: 17, y: 19, color: '#FFFFFF' } ], // 5: Fangs
  [ { x: 15, y: 18, color: '#1a1a1a' }, { x: 16, y: 18, color: '#1a1a1a' }, { x: 13, y: 19, color: '#1a1a1a' }, { x: 14, y: 19, color: '#1a1a1a' }, { x: 17, y: 19, color: '#1a1a1a' }, { x: 18, y: 19, color: '#1a1a1a' } ], // 6: Cat
  [ { x: 15, y: 18, color: '#1a1a1a' }, { x: 16, y: 18, color: '#1a1a1a' }, { x: 14, y: 19, color: '#1a1a1a' }, { x: 17, y: 19, color: '#1a1a1a' }, { x: 14, y: 20, color: '#1a1a1a' }, { x: 17, y: 20, color: '#1a1a1a' }, { x: 15, y: 21, color: '#1a1a1a' }, { x: 16, y: 21, color: '#1a1a1a' } ], // 7: O
];

const HEAD_OPTIONS = [
  [], // 0
  [ ...rect(5, 3, 22, 1, '#E63946'), ...rect(5, 4, 22, 1, '#2A5298'), ...rect(5, 5, 22, 1, '#E63946'), ...rect(15, 1, 2, 2, '#E63946') ], // 1: Beanie
  [ ...rect(15, -2, 2, 2, '#FF1493'), ...rect(14, 0, 4, 1, '#FFD700'), ...rect(13, 1, 6, 1, '#FF1493'), ...rect(12, 2, 8, 1, '#00BCD4'), ...rect(11, 3, 10, 1, '#FFD700'), ...rect(10, 4, 12, 1, '#FF1493'), ...rect(9, 5, 14, 1, '#00BCD4') ], // 2: Party
  [ ...rect(15, -2, 2, 2, '#D3D3D3'), ...rect(14, 0, 4, 1, '#C0C0C0'), ...rect(13, 1, 6, 1, '#D3D3D3'), ...rect(12, 2, 8, 1, '#A9A9A9'), ...rect(11, 3, 10, 1, '#C0C0C0'), ...rect(10, 4, 12, 1, '#D3D3D3'), ...rect(9, 5, 14, 1, '#808080'), { x: 15, y: -1, color: '#E8E8E8' }, { x: 14, y: 1, color: '#E8E8E8' }, { x: 17, y: 3, color: '#E8E8E8' }, { x: 12, y: 5, color: '#E8E8E8' } ], // 3: Tinfoil
  [ ...rect(10, 1, 12, 3, '#8B4513'), ...rect(10, 2, 12, 1, '#A0522D'), ...rect(10, 4, 12, 1, '#FFD700'), ...rect(3, 5, 26, 2, '#8B4513'), ...rect(4, 5, 24, 1, '#A0522D') ], // 4: Cowboy
  [ ...rect(6, 4, 20, 2, '#333333'), ...rect(7, 3, 18, 1, '#333333'), ...rect(4, 5, 3, 4, '#333333'), { x: 5, y: 6, color: '#555555' }, { x: 5, y: 7, color: '#555555' }, ...rect(25, 5, 3, 4, '#333333'), { x: 26, y: 6, color: '#555555' }, { x: 26, y: 7, color: '#555555' } ], // 5: Headphones
  [ ...rect(9, 2, 14, 1, '#FFD700'), ...rect(8, 3, 16, 1, '#FFD700'), ...rect(9, 4, 14, 1, '#FFD700'), ...rect(10, 3, 12, 1, '#FFEB3B') ], // 6: Halo
  [ ...rect(8, 4, 16, 2, '#2A5298'), ...rect(7, 5, 18, 1, '#1a1a5a'), { x: 15, y: 3, color: '#888888' }, { x: 16, y: 3, color: '#888888' }, ...rect(11, 2, 4, 1, '#E63946'), ...rect(17, 2, 4, 1, '#E63946'), { x: 10, y: 1, color: '#E63946' }, { x: 21, y: 1, color: '#E63946' } ], // 7: Propeller
];

const HELD_OPTIONS = [
  [], // 0
  [ ...rect(27, 14, 4, 5, '#FFFFFF'), ...rect(27, 13, 4, 1, '#DDDDDD'), ...rect(27, 19, 4, 1, '#DDDDDD'), ...rect(31, 15, 1, 3, '#DDDDDD'), ...rect(27, 14, 4, 1, '#6F4E37'), { x: 28, y: 11, color: '#888888' }, { x: 30, y: 12, color: '#888888' } ], // 1: Coffee
  [ ...rect(0, 14, 5, 5, '#333333'), ...rect(1, 15, 3, 3, '#4FC3F7'), ...rect(0, 19, 6, 1, '#555555'), ...rect(0, 20, 7, 1, '#444444') ], // 2: Laptop
  [ { x: 29, y: 16, color: '#FF4500' }, { x: 28, y: 15, color: '#FF6347' }, { x: 29, y: 15, color: '#FF4500' }, { x: 30, y: 15, color: '#FF6347' }, { x: 28, y: 14, color: '#FF8C00' }, { x: 29, y: 14, color: '#FF4500' }, { x: 30, y: 14, color: '#FF8C00' }, { x: 29, y: 13, color: '#FFD700' }, { x: 29, y: 12, color: '#FFEB3B' } ], // 3: Flame
  [ ...rect(5, 24, 22, 5, '#333333'), ...rect(5, 23, 22, 1, '#222222'), ...rect(5, 29, 22, 1, '#222222'), { x: 7, y: 24, color: '#FF6B4A' }, ...rect(11, 28, 10, 1, '#666666') ], // 4: Keyboard
  [ ...rect(27, 8, 4, 3, '#FF1493'), ...rect(28, 7, 2, 1, '#FF1493'), ...rect(28, 11, 2, 1, '#FF1493'), { x: 28, y: 8, color: '#FF69B4' }, { x: 29, y: 12, color: '#888888' }, { x: 28, y: 13, color: '#888888' }, { x: 29, y: 14, color: '#888888' } ], // 5: Balloon
  [ { x: 29, y: 8, color: '#C0C0C0' }, { x: 29, y: 9, color: '#D3D3D3' }, { x: 29, y: 10, color: '#C0C0C0' }, { x: 29, y: 11, color: '#D3D3D3' }, { x: 29, y: 12, color: '#C0C0C0' }, { x: 28, y: 13, color: '#FFD700' }, { x: 29, y: 13, color: '#FFD700' }, { x: 30, y: 13, color: '#FFD700' }, { x: 29, y: 14, color: '#8B4513' }, { x: 29, y: 15, color: '#8B4513' }, { x: 29, y: 16, color: '#FFD700' } ], // 6: Sword
  [ ...[8,9,10,11,12,13,14,15].map(y => ({ x: 29, y, color: '#888888' })), ...rect(30, 8, 2, 2, '#FF6B4A'), ...rect(30, 10, 2, 2, '#FFFFFF'), ...rect(30, 12, 2, 1, '#FF6B4A') ], // 7: Flag
];

// ─── Compositing ───

const GRID_SIZE = 32;
const Y_OFFSET = 3;

function resolveColor(color, bodyColor) {
  if (color === 'body') return '#' + bodyColor;
  return color;
}

function compositeLayers(state) {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

  const heldFront = state.held !== 0 ? HELD_OPTIONS[state.held] : [];

  const layers = [
    BASE_BODY,
    SPIKE_OPTIONS[state.spikes] || [],
    EYE_OPTIONS[state.eyes] || [],
    MOUTH_OPTIONS[state.mouth] || [],
    HEAD_OPTIONS[state.head] || [],
    heldFront,
  ];

  for (const layer of layers) {
    for (const pixel of layer) {
      const py = pixel.y + Y_OFFSET;
      if (pixel.x >= 0 && pixel.x < GRID_SIZE && py >= 0 && py < GRID_SIZE) {
        grid[py][pixel.x] = resolveColor(pixel.color, state.color);
      }
    }
  }

  return grid;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function generateAnsi(state) {
  const grid = compositeLayers(state);

  let minX = GRID_SIZE, maxX = 0, minY = GRID_SIZE, maxY = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x]) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
  }
  if ((maxY - minY + 1) % 2 !== 0) maxY++;

  let lastFg = '', lastBg = '';
  const lines = [];

  for (let y = minY; y <= maxY; y += 2) {
    let line = '';
    lastFg = ''; lastBg = '';

    for (let x = minX; x <= maxX; x++) {
      const top = grid[y]?.[x] || null;
      const bottom = grid[y + 1]?.[x] || null;

      if (top && bottom) {
        const { r: tr, g: tg, b: tb } = hexToRgb(top);
        const { r: br, g: bg, b: bb } = hexToRgb(bottom);
        const fc = `${tr};${tg};${tb}`, bc = `${br};${bg};${bb}`;
        if (fc !== lastFg) { line += `\\033[38;2;${fc}m`; lastFg = fc; }
        if (bc !== lastBg) { line += `\\033[48;2;${bc}m`; lastBg = bc; }
        line += '\u2580';
      } else if (top) {
        const { r, g, b } = hexToRgb(top);
        const fc = `${r};${g};${b}`;
        if (fc !== lastFg) { line += `\\033[38;2;${fc}m`; lastFg = fc; }
        if (lastBg !== '0') { line += '\\033[49m'; lastBg = '0'; }
        line += '\u2580';
      } else if (bottom) {
        const { r, g, b } = hexToRgb(bottom);
        const fc = `${r};${g};${b}`;
        if (fc !== lastFg) { line += `\\033[38;2;${fc}m`; lastFg = fc; }
        if (lastBg !== '0') { line += '\\033[49m'; lastBg = '0'; }
        line += '\u2584';
      } else {
        if (lastFg !== '' || lastBg !== '') { line += '\\033[0m'; lastFg = ''; lastBg = ''; }
        line += ' ';
      }
    }
    line += '\\033[0m';
    lines.push(line);
  }

  return `echo $'${lines.join('\\n')}\\n'`;
}

// ─── Handler ───

export default async (req) => {
  const url = new URL(req.url);
  const config = url.pathname.split('/').pop() || 'FF6B4A-0-0-0-0-0-0-0';

  const parts = config.split('-');
  if (parts.length !== 6) {
    return new Response('# Invalid config\necho "Invalid Claw\'d config"\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      status: 400,
    });
  }

  const color = /^[0-9a-fA-F]{6}$/.test(parts[0]) ? parts[0].toUpperCase() : 'FF6B4A';
  const nums = parts.slice(1).map(Number);
  if (nums.some(n => isNaN(n) || n < 0 || n > 7)) {
    return new Response('# Invalid config\necho "Invalid Claw\'d config"\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      status: 400,
    });
  }

  const state = { color, spikes: nums[0], eyes: nums[1], mouth: nums[2], head: nums[3], held: nums[4] };
  const ansi = generateAnsi(state);

  return new Response(ansi + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};

export const config = {
  path: '/t/*',
};
