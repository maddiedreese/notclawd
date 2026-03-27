import { GRID_SIZE } from '../utils/constants.js';
import { compositeLayers } from './canvasRenderer.js';

function hexToRgb(hex) {
  const h = hex.replace('#', '').replace('rgb(', '').replace(')', '');
  if (h.includes(',')) {
    const [r, g, b] = h.split(',').map(Number);
    return { r, g, b };
  }
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function generateAnsiString(state) {
  const grid = compositeLayers(state);

  // Find bounds to trim transparent edges
  let minX = GRID_SIZE, maxX = 0, minY = GRID_SIZE, maxY = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Ensure even number of rows for half-block pairing
  if ((maxY - minY + 1) % 2 !== 0) maxY++;

  // Use $'...' ANSI-C quoting with \033 — works in bash and zsh
  // Track current colors to skip redundant codes
  let lastFg = '';
  let lastBg = '';
  let lines = [];

  for (let y = minY; y <= maxY; y += 2) {
    let line = '';
    lastFg = '';
    lastBg = '';

    for (let x = minX; x <= maxX; x++) {
      const top = grid[y]?.[x] || null;
      const bottom = grid[y + 1]?.[x] || null;

      if (top && bottom) {
        const { r: tr, g: tg, b: tb } = hexToRgb(top);
        const { r: br, g: bg, b: bb } = hexToRgb(bottom);
        const fgCode = `${tr};${tg};${tb}`;
        const bgCode = `${br};${bg};${bb}`;

        if (fgCode !== lastFg) {
          line += `\\033[38;2;${fgCode}m`;
          lastFg = fgCode;
        }
        if (bgCode !== lastBg) {
          line += `\\033[48;2;${bgCode}m`;
          lastBg = bgCode;
        }
        line += '\u2580'; // ▀
      } else if (top) {
        const { r, g, b } = hexToRgb(top);
        const fgCode = `${r};${g};${b}`;
        if (fgCode !== lastFg) {
          line += `\\033[38;2;${fgCode}m`;
          lastFg = fgCode;
        }
        if (lastBg !== '0') {
          line += '\\033[49m';
          lastBg = '0';
        }
        line += '\u2580'; // ▀
      } else if (bottom) {
        const { r, g, b } = hexToRgb(bottom);
        const fgCode = `${r};${g};${b}`;
        if (fgCode !== lastFg) {
          line += `\\033[38;2;${fgCode}m`;
          lastFg = fgCode;
        }
        if (lastBg !== '0') {
          line += '\\033[49m';
          lastBg = '0';
        }
        line += '\u2584'; // ▄
      } else {
        if (lastFg !== '' || lastBg !== '') {
          line += '\\033[0m';
          lastFg = '';
          lastBg = '';
        }
        line += ' ';
      }
    }
    line += '\\033[0m';
    lines.push(line);
  }

  // $'...' quoting interprets \033 as actual ESC byte in bash/zsh
  return `echo $'${lines.join('\\n')}\\n'`;
}
