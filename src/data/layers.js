// Each layer is an array of { x, y, color } entries.
// color = "body" means inherit user's chosen body color.
// color = hex string for fixed colors.
// The grid is 32x32, origin top-left.

// Helper: generate filled rect
function rect(x0, y0, w, h, color) {
  const pixels = [];
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) pixels.push({ x, y, color });
  return pixels;
}

// ─── BASE BODY ───
// Traced from reference image. Flat-topped rectangle with two eye cutouts,
// wider arm band at mid-height, and four leg pillars.
//
// Layout on 32x32 grid:
//   Head (solid):     y=6-9,   x=6-25  (20 wide)
//   Eyes:             y=10-13, x=6-25  with gaps at x=9-10 and x=21-22
//   Arms (solid):     y=14-17, x=2-29  (28 wide)
//   Lower body:       y=18-21, x=6-25  (20 wide)
//   Legs (4 pillars): y=22-25, pillars at x=7-8, x=11-12, x=19-20, x=23-24

export const BASE_BODY = [
  // Head — solid rectangle
  ...rect(6, 6, 20, 4, 'body'),

  // Eye region — body with two cutouts
  // Left of left eye
  ...rect(6, 10, 3, 4, 'body'),
  // Between eyes
  ...rect(11, 10, 10, 4, 'body'),
  // Right of right eye
  ...rect(23, 10, 3, 4, 'body'),

  // Arms — wider solid band
  ...rect(2, 14, 28, 4, 'body'),

  // Lower body — solid rectangle
  ...rect(6, 18, 20, 4, 'body'),

  // Legs — four pillars (eye slot gaps continue through legs)
  // Symmetric around center x=15.5
  ...rect(8, 22, 2, 4, 'body'),   // left-outer
  ...rect(12, 22, 2, 4, 'body'),  // left-inner
  ...rect(18, 22, 2, 4, 'body'),  // right-inner
  ...rect(22, 22, 2, 4, 'body'),  // right-outer
];

// ─── SPIKES (top-of-head variations) ───
const SPIKE_OPTIONS = [];

// 0: Default — flat top (nothing extra, base body is already flat)
SPIKE_OPTIONS[0] = [];

// 1: Flame tips — flames rising from top edge
SPIKE_OPTIONS[1] = [
  ...rect(8, 4, 3, 2, '#FF8C00'),
  ...rect(14, 3, 4, 3, '#FF4500'),
  ...rect(22, 4, 3, 2, '#FF8C00'),
  { x: 9, y: 3, color: '#FFD700' },
  { x: 15, y: 2, color: '#FFD700' },
  { x: 16, y: 2, color: '#FFD700' },
  { x: 23, y: 3, color: '#FFD700' },
];

// 2: Rainbow — colored blocks along top edge
SPIKE_OPTIONS[2] = [
  ...rect(6, 4, 3, 2, '#FF0000'),
  ...rect(9, 4, 3, 2, '#FF8C00'),
  ...rect(12, 4, 3, 2, '#FFD700'),
  ...rect(15, 4, 3, 2, '#00C853'),
  ...rect(18, 4, 3, 2, '#2979FF'),
  ...rect(21, 4, 3, 2, '#7C4DFF'),
  ...rect(24, 4, 2, 2, '#FF1493'),
];

// 3: Bedhead — messy uneven bumps on top
SPIKE_OPTIONS[3] = [
  ...rect(7, 4, 2, 2, 'body'),
  ...rect(12, 3, 3, 3, 'body'),
  ...rect(18, 2, 2, 4, 'body'),
  ...rect(23, 4, 3, 2, 'body'),
  ...rect(10, 5, 2, 1, 'body'),
  ...rect(16, 4, 2, 2, 'body'),
];

// 4: Crown — golden crown on top
SPIKE_OPTIONS[4] = [
  // Crown base band
  ...rect(6, 4, 20, 2, '#FFD700'),
  // Crown points
  ...rect(7, 2, 2, 2, '#FFD700'),
  ...rect(15, 1, 2, 3, '#FFD700'),
  ...rect(23, 2, 2, 2, '#FFD700'),
  // Dark band
  ...rect(6, 5, 20, 1, '#B8860B'),
  // Jewels
  { x: 8, y: 3, color: '#FF0000' },
  { x: 15, y: 2, color: '#4169E1' },
  { x: 16, y: 2, color: '#4169E1' },
  { x: 23, y: 3, color: '#FF0000' },
];

// 5: Mohawk — single ridge down the center
SPIKE_OPTIONS[5] = [
  ...rect(14, 3, 4, 3, 'body'),
  ...rect(15, 1, 2, 2, 'body'),
];

// 6: Antenna — two thin tall stalks with bobbles
SPIKE_OPTIONS[6] = [
  { x: 11, y: 5, color: 'body' },
  { x: 11, y: 4, color: 'body' },
  { x: 11, y: 3, color: 'body' },
  { x: 11, y: 2, color: 'body' },
  { x: 10, y: 1, color: '#FFD700' },
  { x: 11, y: 1, color: '#FFD700' },
  { x: 12, y: 1, color: '#FFD700' },
  { x: 11, y: 0, color: '#FFD700' },
  { x: 20, y: 5, color: 'body' },
  { x: 20, y: 4, color: 'body' },
  { x: 20, y: 3, color: 'body' },
  { x: 20, y: 2, color: 'body' },
  { x: 19, y: 1, color: '#FFD700' },
  { x: 20, y: 1, color: '#FFD700' },
  { x: 21, y: 1, color: '#FFD700' },
  { x: 20, y: 0, color: '#FFD700' },
];

// 7: Horns — devil horns
SPIKE_OPTIONS[7] = [
  ...rect(7, 4, 3, 2, '#C62828'),
  ...rect(8, 2, 2, 2, '#C62828'),
  { x: 9, y: 1, color: '#C62828' },
  ...rect(22, 4, 3, 2, '#C62828'),
  ...rect(22, 2, 2, 2, '#C62828'),
  { x: 22, y: 1, color: '#C62828' },
];

export { SPIKE_OPTIONS };

// ─── EYES ───
// The base body has empty cutouts at x=9-10 and x=21-22, y=10-13.
// Default eyes leave these empty (transparent). Non-default options
// first fill the cutouts with body color, then draw the design.
const EYE_OPTIONS = [];

// Helper: fill eye cutouts with body color
const FILL_EYE_CUTOUTS = [
  ...rect(9, 10, 2, 4, 'body'),
  ...rect(21, 10, 2, 4, 'body'),
];

// 0: Default — empty cutouts (the iconic Claw'd look)
EYE_OPTIONS[0] = [];

// 1: Heart eyes (symmetric around x=15.5: left centered x=9, right centered x=22)
EYE_OPTIONS[1] = [
  ...FILL_EYE_CUTOUTS,
  // Left heart
  { x: 8, y: 10, color: '#FF1493' },
  { x: 10, y: 10, color: '#FF1493' },
  { x: 8, y: 11, color: '#FF1493' },
  { x: 9, y: 11, color: '#FF1493' },
  { x: 10, y: 11, color: '#FF1493' },
  { x: 9, y: 12, color: '#FF1493' },
  // Right heart
  { x: 21, y: 10, color: '#FF1493' },
  { x: 23, y: 10, color: '#FF1493' },
  { x: 21, y: 11, color: '#FF1493' },
  { x: 22, y: 11, color: '#FF1493' },
  { x: 23, y: 11, color: '#FF1493' },
  { x: 22, y: 12, color: '#FF1493' },
];

// 2: Sleepy — horizontal closed lines (x=8-11 mirrors to x=20-23)
EYE_OPTIONS[2] = [
  ...FILL_EYE_CUTOUTS,
  ...rect(8, 11, 4, 1, '#1a1a1a'),
  ...rect(8, 12, 4, 1, '#1a1a1a'),
  ...rect(20, 11, 4, 1, '#1a1a1a'),
  ...rect(20, 12, 4, 1, '#1a1a1a'),
];

// 3: X_X — dead/crashed
EYE_OPTIONS[3] = [
  ...FILL_EYE_CUTOUTS,
  // Left X
  { x: 8, y: 10, color: '#1a1a1a' },
  { x: 10, y: 10, color: '#1a1a1a' },
  { x: 9, y: 11, color: '#1a1a1a' },
  { x: 8, y: 12, color: '#1a1a1a' },
  { x: 10, y: 12, color: '#1a1a1a' },
  // Right X
  { x: 21, y: 10, color: '#1a1a1a' },
  { x: 23, y: 10, color: '#1a1a1a' },
  { x: 22, y: 11, color: '#1a1a1a' },
  { x: 21, y: 12, color: '#1a1a1a' },
  { x: 23, y: 12, color: '#1a1a1a' },
];

// 4: Sparkle — star eyes
EYE_OPTIONS[4] = [
  ...FILL_EYE_CUTOUTS,
  // Left sparkle
  { x: 9, y: 9, color: '#FFD700' },
  { x: 8, y: 11, color: '#FFD700' },
  { x: 9, y: 11, color: '#FFFFFF' },
  { x: 10, y: 11, color: '#FFD700' },
  { x: 9, y: 13, color: '#FFD700' },
  { x: 7, y: 11, color: '#FFD700' },
  { x: 11, y: 11, color: '#FFD700' },
  // Right sparkle
  { x: 22, y: 9, color: '#FFD700' },
  { x: 23, y: 11, color: '#FFD700' },
  { x: 22, y: 11, color: '#FFFFFF' },
  { x: 21, y: 11, color: '#FFD700' },
  { x: 22, y: 13, color: '#FFD700' },
  { x: 24, y: 11, color: '#FFD700' },
  { x: 20, y: 11, color: '#FFD700' },
];

// 5: Cyclops — single large eye in center
EYE_OPTIONS[5] = [
  ...FILL_EYE_CUTOUTS,
  ...rect(14, 10, 4, 4, '#FFFFFF'),
  ...rect(15, 11, 2, 2, '#1a1a1a'),
];

// 6: Wink — left open, right closed
EYE_OPTIONS[6] = [
  // Left eye stays empty (default cutout)
  // Fill right cutout and draw closed eye
  ...rect(21, 10, 2, 4, 'body'),
  ...rect(20, 11, 4, 1, '#1a1a1a'),
];

// 7: Pixel shades — sunglasses
EYE_OPTIONS[7] = [
  ...FILL_EYE_CUTOUTS,
  // Left lens
  ...rect(7, 10, 6, 3, '#1a1a1a'),
  // Bridge
  ...rect(13, 11, 6, 1, '#1a1a1a'),
  // Right lens
  ...rect(19, 10, 6, 3, '#1a1a1a'),
  // Lens shine
  { x: 8, y: 10, color: '#4444FF' },
  { x: 20, y: 10, color: '#4444FF' },
];

export { EYE_OPTIONS };

// ─── MOUTH ───
const MOUTH_OPTIONS = [];

// 0: None — Claw'd has no visible mouth by default
MOUTH_OPTIONS[0] = [];

// 1: Excited — open mouth
MOUTH_OPTIONS[1] = [
  ...rect(13, 18, 6, 2, '#1a1a1a'),
  ...rect(14, 18, 4, 1, '#C62828'),
];

// 2: Tongue out
MOUTH_OPTIONS[2] = [
  ...rect(13, 18, 6, 1, '#1a1a1a'),
  ...rect(15, 19, 2, 2, '#FF4D6D'),
];

// 3: Flat line
MOUTH_OPTIONS[3] = [
  ...rect(12, 18, 8, 1, '#1a1a1a'),
];

// 4: Smirk
MOUTH_OPTIONS[4] = [
  ...rect(14, 18, 5, 1, '#1a1a1a'),
  { x: 19, y: 17, color: '#1a1a1a' },
];

// 5: Fangs — two small triangles
MOUTH_OPTIONS[5] = [
  ...rect(13, 18, 6, 1, '#1a1a1a'),
  { x: 14, y: 19, color: '#FFFFFF' },
  { x: 17, y: 19, color: '#FFFFFF' },
];

// 6: Cat mouth :3
MOUTH_OPTIONS[6] = [
  { x: 15, y: 18, color: '#1a1a1a' },
  { x: 16, y: 18, color: '#1a1a1a' },
  { x: 13, y: 19, color: '#1a1a1a' },
  { x: 14, y: 19, color: '#1a1a1a' },
  { x: 17, y: 19, color: '#1a1a1a' },
  { x: 18, y: 19, color: '#1a1a1a' },
];

// 7: O mouth — surprised
MOUTH_OPTIONS[7] = [
  { x: 15, y: 18, color: '#1a1a1a' },
  { x: 16, y: 18, color: '#1a1a1a' },
  { x: 14, y: 19, color: '#1a1a1a' },
  { x: 17, y: 19, color: '#1a1a1a' },
  { x: 14, y: 20, color: '#1a1a1a' },
  { x: 17, y: 20, color: '#1a1a1a' },
  { x: 15, y: 21, color: '#1a1a1a' },
  { x: 16, y: 21, color: '#1a1a1a' },
];

export { MOUTH_OPTIONS };

// ─── HEAD ACCESSORIES ───
const HEAD_OPTIONS = [];

// 0: None
HEAD_OPTIONS[0] = [];

// 1: Beanie
HEAD_OPTIONS[1] = [
  ...rect(5, 3, 22, 1, '#E63946'),
  ...rect(5, 4, 22, 1, '#2A5298'),
  ...rect(5, 5, 22, 1, '#E63946'),
  // Pom-pom
  ...rect(15, 1, 2, 2, '#E63946'),
];

// 2: Party hat (cone with point)
HEAD_OPTIONS[2] = [
  // Point / pom-pom at tip
  ...rect(15, -2, 2, 2, '#FF1493'),
  ...rect(14, 0, 4, 1, '#FFD700'),
  ...rect(13, 1, 6, 1, '#FF1493'),
  ...rect(12, 2, 8, 1, '#00BCD4'),
  ...rect(11, 3, 10, 1, '#FFD700'),
  ...rect(10, 4, 12, 1, '#FF1493'),
  ...rect(9, 5, 14, 1, '#00BCD4'),
];

// 3: Tinfoil hat (cone with pointed tip)
HEAD_OPTIONS[3] = [
  // Pointed tip
  ...rect(15, -2, 2, 2, '#D3D3D3'),
  ...rect(14, 0, 4, 1, '#C0C0C0'),
  ...rect(13, 1, 6, 1, '#D3D3D3'),
  ...rect(12, 2, 8, 1, '#A9A9A9'),
  ...rect(11, 3, 10, 1, '#C0C0C0'),
  ...rect(10, 4, 12, 1, '#D3D3D3'),
  ...rect(9, 5, 14, 1, '#808080'),
  // Crinkle highlights
  { x: 15, y: -1, color: '#E8E8E8' },
  { x: 14, y: 1, color: '#E8E8E8' },
  { x: 17, y: 3, color: '#E8E8E8' },
  { x: 12, y: 5, color: '#E8E8E8' },
];

// 4: Cowboy hat
HEAD_OPTIONS[4] = [
  // Crown
  ...rect(10, 1, 12, 3, '#8B4513'),
  ...rect(10, 2, 12, 1, '#A0522D'),
  // Hat band
  ...rect(10, 4, 12, 1, '#FFD700'),
  // Wide brim
  ...rect(3, 5, 26, 2, '#8B4513'),
  ...rect(4, 5, 24, 1, '#A0522D'),
];

// 5: Headphones
HEAD_OPTIONS[5] = [
  // Band across top
  ...rect(6, 4, 20, 2, '#333333'),
  ...rect(7, 3, 18, 1, '#333333'),
  // Left ear cup
  ...rect(4, 5, 3, 4, '#333333'),
  ...rect(5, 6, 1, 2, '#555555'),
  // Right ear cup
  ...rect(25, 5, 3, 4, '#333333'),
  ...rect(26, 6, 1, 2, '#555555'),
];

// 6: Halo
HEAD_OPTIONS[6] = [
  ...rect(9, 2, 14, 1, '#FFD700'),
  ...rect(8, 3, 16, 1, '#FFD700'),
  ...rect(9, 4, 14, 1, '#FFD700'),
  // Inner transparent (body-colored to punch hole)
  ...rect(10, 3, 12, 1, '#FFEB3B'),
];

// 7: Propeller hat
HEAD_OPTIONS[7] = [
  // Cap base
  ...rect(8, 4, 16, 2, '#2A5298'),
  // Cap brim
  ...rect(7, 5, 18, 1, '#1a1a5a'),
  // Propeller center
  { x: 15, y: 3, color: '#888888' },
  { x: 16, y: 3, color: '#888888' },
  // Propeller blades
  ...rect(11, 2, 4, 1, '#E63946'),
  ...rect(17, 2, 4, 1, '#E63946'),
  { x: 10, y: 1, color: '#E63946' },
  { x: 21, y: 1, color: '#E63946' },
];

export { HEAD_OPTIONS };

// ─── HELD ITEMS ───
const HELD_OPTIONS = [];

// 0: Nothing
HELD_OPTIONS[0] = [];

// 1: Coffee mug (right side)
HELD_OPTIONS[1] = [
  ...rect(27, 14, 4, 5, '#FFFFFF'),
  ...rect(27, 13, 4, 1, '#DDDDDD'),
  ...rect(27, 19, 4, 1, '#DDDDDD'),
  ...rect(31, 15, 1, 3, '#DDDDDD'),
  ...rect(27, 14, 4, 1, '#6F4E37'),
  { x: 28, y: 11, color: '#888888' },
  { x: 30, y: 12, color: '#888888' },
];

// 2: Laptop (left side)
HELD_OPTIONS[2] = [
  ...rect(0, 14, 5, 5, '#333333'),
  ...rect(1, 15, 3, 3, '#4FC3F7'),
  ...rect(0, 19, 6, 1, '#555555'),
  ...rect(0, 20, 7, 1, '#444444'),
];

// 3: Flame (hovering in right hand)
HELD_OPTIONS[3] = [
  { x: 29, y: 16, color: '#FF4500' },
  { x: 28, y: 15, color: '#FF6347' },
  { x: 29, y: 15, color: '#FF4500' },
  { x: 30, y: 15, color: '#FF6347' },
  { x: 28, y: 14, color: '#FF8C00' },
  { x: 29, y: 14, color: '#FF4500' },
  { x: 30, y: 14, color: '#FF8C00' },
  { x: 29, y: 13, color: '#FFD700' },
  { x: 29, y: 12, color: '#FFEB3B' },
];

// 4: Mechanical keyboard (bottom)
HELD_OPTIONS[4] = [
  ...rect(5, 24, 22, 5, '#333333'),
  ...rect(5, 23, 22, 1, '#222222'),
  ...rect(5, 29, 22, 1, '#222222'),
  // Key rows
  ...rect(7, 24, 1, 1, '#555555'),
  ...rect(9, 24, 1, 1, '#555555'),
  ...rect(11, 24, 1, 1, '#555555'),
  ...rect(13, 24, 1, 1, '#555555'),
  ...rect(15, 24, 1, 1, '#555555'),
  ...rect(17, 24, 1, 1, '#555555'),
  ...rect(19, 24, 1, 1, '#555555'),
  ...rect(21, 24, 1, 1, '#555555'),
  ...rect(23, 24, 1, 1, '#555555'),
  ...rect(8, 26, 1, 1, '#555555'),
  ...rect(10, 26, 1, 1, '#555555'),
  ...rect(12, 26, 1, 1, '#555555'),
  ...rect(14, 26, 1, 1, '#555555'),
  ...rect(16, 26, 1, 1, '#555555'),
  ...rect(18, 26, 1, 1, '#555555'),
  ...rect(20, 26, 1, 1, '#555555'),
  ...rect(22, 26, 1, 1, '#555555'),
  { x: 7, y: 24, color: '#FF6B4A' },
  ...rect(11, 28, 10, 1, '#666666'),
];

// 5: Balloon (right side)
HELD_OPTIONS[5] = [
  // Balloon
  ...rect(27, 8, 4, 3, '#FF1493'),
  ...rect(28, 7, 2, 1, '#FF1493'),
  ...rect(28, 11, 2, 1, '#FF1493'),
  { x: 28, y: 8, color: '#FF69B4' },
  // String
  { x: 29, y: 12, color: '#888888' },
  { x: 28, y: 13, color: '#888888' },
  { x: 29, y: 14, color: '#888888' },
];

// 6: Sword (right side)
HELD_OPTIONS[6] = [
  // Blade
  { x: 29, y: 8, color: '#C0C0C0' },
  { x: 29, y: 9, color: '#D3D3D3' },
  { x: 29, y: 10, color: '#C0C0C0' },
  { x: 29, y: 11, color: '#D3D3D3' },
  { x: 29, y: 12, color: '#C0C0C0' },
  // Guard
  { x: 28, y: 13, color: '#FFD700' },
  { x: 29, y: 13, color: '#FFD700' },
  { x: 30, y: 13, color: '#FFD700' },
  // Grip
  { x: 29, y: 14, color: '#8B4513' },
  { x: 29, y: 15, color: '#8B4513' },
  // Pommel
  { x: 29, y: 16, color: '#FFD700' },
];

// 7: Flag (right side)
HELD_OPTIONS[7] = [
  // Pole
  { x: 29, y: 8, color: '#888888' },
  { x: 29, y: 9, color: '#888888' },
  { x: 29, y: 10, color: '#888888' },
  { x: 29, y: 11, color: '#888888' },
  { x: 29, y: 12, color: '#888888' },
  { x: 29, y: 13, color: '#888888' },
  { x: 29, y: 14, color: '#888888' },
  { x: 29, y: 15, color: '#888888' },
  // Flag
  ...rect(30, 8, 2, 2, '#FF6B4A'),
  ...rect(30, 10, 2, 2, '#FFFFFF'),
  ...rect(30, 12, 2, 1, '#FF6B4A'),
];

export { HELD_OPTIONS };

// ─── LAYER LABELS ───
export const SPIKE_LABELS = ['Default', 'Flame Tips', 'Rainbow', 'Bedhead', 'Crown', 'Mohawk', 'Antenna', 'Horns'];
export const EYE_LABELS = ['Default', 'Heart Eyes', 'Sleepy', 'X_X', 'Sparkle', 'Cyclops', 'Wink', 'Shades'];
export const MOUTH_LABELS = ['None', 'Excited', 'Tongue Out', 'Flat Line', 'Smirk', 'Fangs', 'Cat :3', 'Surprised'];
export const HEAD_LABELS = ['None', 'Beanie', 'Party Hat', 'Tinfoil Hat', 'Cowboy Hat', 'Headphones', 'Halo', 'Propeller'];
export const HELD_LABELS = ['Nothing', 'Coffee Mug', 'Laptop', 'Flame', 'Keyboard', 'Balloon', 'Sword', 'Flag'];
