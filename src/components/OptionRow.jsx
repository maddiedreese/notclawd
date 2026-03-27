import { useEffect, useRef } from 'react';
import { GRID_SIZE } from '../utils/constants.js';

function renderMiniCanvas(canvas, pixels, bodyColor) {
  const ctx = canvas.getContext('2d');
  const scale = 2;
  canvas.width = GRID_SIZE * scale;
  canvas.height = GRID_SIZE * scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const pixel of pixels) {
    if (pixel.x >= 0 && pixel.x < GRID_SIZE && pixel.y >= 0 && pixel.y < GRID_SIZE) {
      let color = pixel.color;
      if (color === 'body') color = '#' + bodyColor;
      ctx.fillStyle = color;
      ctx.fillRect(pixel.x * scale, pixel.y * scale, scale, scale);
    }
  }
}

function MiniPreview({ pixels, bodyColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && pixels.length > 0) {
      renderMiniCanvas(canvasRef.current, pixels, bodyColor);
    }
  }, [pixels, bodyColor]);

  if (pixels.length === 0) {
    return (
      <div className="mini-preview mini-preview-empty">
        <span>-</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="mini-preview"
    />
  );
}

export default function OptionRow({ label, options, labels, selected, onSelect, bodyColor }) {
  return (
    <div className="option-row">
      <span className="option-label">{label}</span>
      <div className="option-thumbnails">
        {options.map((pixels, i) => (
          <button
            key={i}
            className={`option-thumb ${selected === i ? 'selected' : ''}`}
            onClick={() => onSelect(i)}
            title={labels[i]}
          >
            <MiniPreview pixels={pixels} bodyColor={bodyColor} />
            <span className="option-thumb-label">{labels[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
