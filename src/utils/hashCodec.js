import { DEFAULT_STATE } from './constants.js';

export function encodeState(state) {
  return `#${state.color}-${state.spikes}-${state.eyes}-${state.mouth}-${state.head}-${state.held}`;
}

export function decodeHash(hash) {
  if (!hash || hash.length < 2) return { ...DEFAULT_STATE };

  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const parts = raw.split('-');

  if (parts.length !== 6) return { ...DEFAULT_STATE };

  const color = /^[0-9a-fA-F]{6}$/.test(parts[0]) ? parts[0].toUpperCase() : DEFAULT_STATE.color;
  const nums = parts.slice(1).map(Number);

  if (nums.some((n) => isNaN(n) || n < 0 || n > 7)) return { ...DEFAULT_STATE };

  return {
    color,
    spikes: nums[0],
    eyes: nums[1],
    mouth: nums[2],
    head: nums[3],
    held: nums[4],
  };
}
