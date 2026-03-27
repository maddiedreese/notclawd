import { GRID_SIZE } from '../utils/constants.js';
import {
  BASE_BODY,
  SPIKE_OPTIONS,
  EYE_OPTIONS,
  MOUTH_OPTIONS,
  HEAD_OPTIONS,
  HELD_OPTIONS,
} from '../data/layers.js';

function resolveColor(color, bodyColor) {
  if (color === 'body') return '#' + bodyColor;
  return color;
}

// Vertical offset to push character down, leaving room for hats at the top
const Y_OFFSET = 3;

export function compositeLayers(state) {
  // Create a 32x32 grid, null = transparent
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

  // Layers bottom to top: held(behind) → body → spikes → eyes → mouth → head → held(front)
  // All held items render in front except none (0)
  const heldBehind = [];
  const heldFront = state.held !== 0 ? HELD_OPTIONS[state.held] : [];

  const layers = [
    heldBehind,
    BASE_BODY,
    SPIKE_OPTIONS[state.spikes],
    EYE_OPTIONS[state.eyes],
    MOUTH_OPTIONS[state.mouth],
    HEAD_OPTIONS[state.head],
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

export function renderToCanvas(canvas, state, scale = 10) {
  const ctx = canvas.getContext('2d');
  canvas.width = GRID_SIZE * scale;
  canvas.height = GRID_SIZE * scale;

  const grid = compositeLayers(state);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

// Render for OG image (centered on dark background)
export function renderOgImage(canvas, state) {
  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  const grid = compositeLayers(state);

  // Scale pixel art to fit nicely
  const pixelScale = 14;
  const artWidth = GRID_SIZE * pixelScale;
  const artHeight = GRID_SIZE * pixelScale;
  const offsetX = (width - artWidth) / 2;
  const offsetY = (height - artHeight) / 2 + 20;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(offsetX + x * pixelScale, offsetY + y * pixelScale, pixelScale, pixelScale);
      }
    }
  }

  // Title text
  ctx.fillStyle = '#FF6B4A';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Not Claw\'d', width / 2, 40);

  ctx.fillStyle = '#666';
  ctx.font = '18px monospace';
  ctx.fillText('definitely not official', width / 2, 65);
}
