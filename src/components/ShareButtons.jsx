import { useState, useCallback } from 'react';
import { encodeState } from '../utils/hashCodec.js';
import { renderToCanvas } from '../renderers/canvasRenderer.js';
import Toast from './Toast.jsx';

const SITE_DOMAIN = 'notclawd.sh';

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-HTTPS / older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

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

  const getShareUrl = () => {
    const config = encodeState(state).slice(1);
    return `https://${SITE_DOMAIN}/c/${config}`;
  };

  const shareToX = () => {
    const url = getShareUrl();
    const text = encodeURIComponent("I made my Not Claw'd \uD83E\uDD94");
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const copyTerminal = async () => {
    try {
      await copyToClipboard(oneLiner);
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
      await copyToClipboard(getShareUrl());
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
