import { useState } from 'react';
import { CURATED_COLORS } from '../data/palette.js';

export default function ColorPicker({ selected, onChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customHex, setCustomHex] = useState(selected);

  const isCustom = !CURATED_COLORS.some(c => c.hex.toUpperCase() === selected.toUpperCase());

  return (
    <div className="option-row">
      <span className="option-label">Color</span>
      <div className="color-picker">
        <div className="color-swatches">
          {CURATED_COLORS.map((c) => (
            <button
              key={c.hex}
              className={`color-swatch ${selected.toUpperCase() === c.hex.toUpperCase() ? 'selected' : ''}`}
              style={{ backgroundColor: '#' + c.hex }}
              onClick={() => {
                onChange(c.hex);
                setShowCustom(false);
              }}
              title={c.name}
            />
          ))}
          <button
            className={`color-swatch color-swatch-custom ${isCustom || showCustom ? 'selected' : ''}`}
            onClick={() => setShowCustom(!showCustom)}
            title="Custom color"
          >
            <span>?</span>
          </button>
        </div>
        {showCustom && (
          <div className="custom-color-input">
            <input
              type="color"
              value={'#' + (customHex || selected)}
              onChange={(e) => {
                const hex = e.target.value.replace('#', '').toUpperCase();
                setCustomHex(hex);
                onChange(hex);
              }}
            />
            <input
              type="text"
              value={customHex || selected}
              placeholder="FF6B4A"
              maxLength={6}
              onChange={(e) => {
                const val = e.target.value.replace('#', '').replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                setCustomHex(val);
                if (val.length === 6) onChange(val.toUpperCase());
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
