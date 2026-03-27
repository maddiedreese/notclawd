import { useState, useCallback, useRef } from 'react';
import { encodeState } from '../utils/hashCodec.js';
import { renderToCanvas } from '../renderers/canvasRenderer.js';
import { GRID_SIZE } from '../utils/constants.js';
import Toast from './Toast.jsx';

const SITE_DOMAIN = 'notclawd.sh';

function getTerminalOneLiner(state) {
  const config = encodeState(state).slice(1);
  return `curl -s ${SITE_DOMAIN}/t/${config} | bash`;
}

export default function ShareButtons({ state }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  const oneLiner = getTerminalOneLiner(state);

  const shareToX = () => {
    const url = window.location.href;
    const text = encodeURIComponent("I made my Not Claw'd \uD83E\uDD94");
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const copyTerminal = async () => {
    try {
      await navigator.clipboard.writeText(oneLiner);
      showToast('Copied!');
    } catch {
      showToast('Failed to copy');
    }
  };

  const downloadPng = () => {
    const canvas = document.createElement('canvas');
    const scale = 16;
    renderToCanvas(canvas, state, scale);
    const link = document.createElement('a');
    link.download = 'not-clawd.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    } catch {
      showToast('Failed to copy');
    }
  };

  return (
    <div className="share-section">
      <div className="terminal-box">
        <div className="terminal-header">
          <span>Add to .zshrc / .bashrc</span>
          <button className="terminal-copy-btn" onClick={copyTerminal}>
            Copy
          </button>
        </div>
        <input
          className="terminal-input"
          value={oneLiner}
          readOnly
          onClick={(e) => e.target.select()}
        />
      </div>

      <div className="share-buttons">
        <button className="share-btn share-x" onClick={shareToX}>
          Share to X
        </button>
        <button className="share-btn share-download" onClick={downloadPng}>
          Download PNG
        </button>
        <button className="share-btn share-link" onClick={copyLink}>
          Copy Link
        </button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
