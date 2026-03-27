import { useEffect, useRef } from 'react';
import { renderToCanvas } from '../renderers/canvasRenderer.js';

export default function Preview({ state }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderToCanvas(canvasRef.current, state, 10);
    }
  }, [state]);

  return (
    <div className="preview-container">
      <canvas
        ref={canvasRef}
        className="preview-canvas"
      />
    </div>
  );
}
